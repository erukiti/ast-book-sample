const path = require('path')

const {transformFileSync} = require('@babel/core')
// const syntaxTypeScript = require('@babel/plugin-syntax-typescript').default
const syntaxFlow = require('@babel/plugin-syntax-flow').default
const stripType = require('@babel/plugin-transform-flow-strip-types').default

const WasCreated = Symbol('WasCreated')

const overloadPlugin = ({types: t}) => {
  const getTypeAnnotation = nodePath => {
    if (!t.isIdentifier(nodePath.node)) {
      return null
    }

    const binding = nodePath.scope.bindings[nodePath.node.name]

    if (!binding || !('typeAnnotation' in binding.identifier)) {
      return null
    }
    const {identifier} = binding

    if (
      identifier.typeAnnotation.type === 'TypeAnnotation' &&
      identifier.typeAnnotation.typeAnnotation.type ===
        'GenericTypeAnnotation' &&
      t.isIdentifier(identifier.typeAnnotation.typeAnnotation.id)
    ) {
      return identifier.typeAnnotation.typeAnnotation.id.name
    }

    if (
      identifier.typeAnnotation.type === 'TSTypeAnnotation' &&
      identifier.typeAnnotation.typeAnnotation.type === 'TSTypeReference' &&
      t.isIdentifier(identifier.typeAnnotation.typeAnnotation.typeName)
    ) {
      return identifier.typeAnnotation.typeAnnotation.typeName.name
    }

    return null
  }

  const _isMayBeTransformed = node => {
    return (
      t.isCallExpression(node) &&
      t.isMemberExpression(node.callee) &&
      t.isStringLiteral(node.callee.property) &&
      node.arguments.length === 1
    )
  }

  const _getType = (nodePath, overloadClasses) => {
    const typeAnnotation = getTypeAnnotation(nodePath)
    if (typeAnnotation && overloadClasses.indexOf(typeAnnotation) !== -1) {
      return typeAnnotation
    }

    const {node} = nodePath
    if (!_isMayBeTransformed(node)) {
      return null
    }

    const argType = _getType(nodePath.get('arguments')[0], overloadClasses)
    const objType = _getType(nodePath.get('callee.object'), overloadClasses)

    if (
      argType &&
      argType === objType &&
      overloadClasses.indexOf(argType) !== -1
    ) {
      return argType
    }

    return null
  }

  const visitor = {
    Program: (nodePath1, state) => {
      nodePath1.traverse({
        BinaryExpression: {
          exit: nodePath => {
            if (nodePath[WasCreated]) {
              return
            }

            const leftType = _getType(
              nodePath.get('left'),
              state.opts.overloadClasses
            )
            const rightType = _getType(
              nodePath.get('right'),
              state.opts.overloadClasses
            )
            if (!leftType || !rightType || leftType !== rightType) {
              return
            }

            const newAst = t.callExpression(
              t.memberExpression(
                nodePath.node.left,
                t.stringLiteral(nodePath.node.operator),
                true
              ),
              [nodePath.node.right]
            )
            nodePath.replaceWith(newAst)
            nodePath[WasCreated] = true
          },
        },
      })
    },
  }

  return {
    inherits: syntaxFlow,
    visitor,
  }
}

const {code, ast, map} = transformFileSync(path.join(__dirname, 'fraction.js'), {
  plugins: [[overloadPlugin, {overloadClasses: ['Fraction']}], stripType],
})
console.log(code)
console.log('')
eval(code)
