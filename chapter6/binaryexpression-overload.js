const WasCreated = Symbol('WasCreated')

const overloadPlugin = ({types: t}) => {
  const _getType = nodePath => {
    return getTypeAnnotation(nodePath)
  }

  const visitor = {
    BinaryExpression: {
      exit: (nodePath, state) => {
        if (nodePath[WasCreated]) {
          return
        }

        const leftType = _getType(nodePath.get('left'))
        const rightType = _getType(nodePath.get('right'))
        if (!leftType || !rightType || leftType !== rightType ||
            state.opts.overloadClasses.indexOf(leftType) === -1
        ) {
          return
        }

        const {left, operator, right} = nodePath.node
        const newAst = t.callExpression(
          t.memberExpression(left, t.stringLiteral(operator), true),
          [right]
        )
        nodePath.replaceWith(newAst)
        nodePath[WasCreated] = true
      },
    },
  }

  return {
    inherits: syntaxFlow,
    visitor,
  }
}
