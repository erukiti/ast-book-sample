const {transform} = require('babel-core')

const source = `
const a = 1 + 2 * 3 / 4
console.log(a)
let b = a + 2
console.log(b)
`

const optimizePlugin = ({types: t}) => {
  const toLiterals = {
    string: value => t.stringLiteral(value),
    number: value => t.numericLiteral(value),
    boolean: value => t.booleanLiteral(value),
    null: value => t.nullLiteral(),
  }

  const valueToLiteral = value => toLiterals[typeof value](value)

  const searchPrevNodes = (nodePath, conditionPaths) => {
    const statement = nodePath.getStatementParent()
    if (!statement) {
      return []
    }
    return statement.getAllPrevSiblings().filter(p => {
      return (
        conditionPaths.filter(v => v.node.start === p.node.start).length > 0
      )
    })
  }

  const evaluateVisitor = {
    exit: nodePath => {
      if (t.isImmutable(nodePath.node)) {
        return
      }

      nodePath.scope.crawl()
      const {confident, value} = nodePath.evaluate()
      if (confident) {
        nodePath.replaceWith(valueToLiteral(value))
      }
    },
    ReferencedIdentifier: nodePath => {
      nodePath.scope.crawl()
      const {name} = nodePath.node
      if (name in nodePath.scope.bindings) {
        const binding = nodePath.scope.bindings[name]
        const violations = searchPrevNodes(nodePath, binding.constantViolations)
        if (violations.length > 0) {
          return
        }
        const {confident, value} = binding.path.get('init').evaluate()
        if (confident) {
          nodePath.replaceWith(valueToLiteral(value))
        }
      }
    },
    AssignmentExpression: {
      exit: nodePath => {
        nodePath.scope.crawl()
        if (!nodePath.get('left').isIdentifier()) {
          return
        }
        const {name} = nodePath.node.left
        if (!(name in nodePath.scope.bindings)) {
          return
        }
        const binding = nodePath.scope.bindings[name]
        const refs = searchPrevNodes(nodePath, binding.referencePaths)
        if (refs.length > 0) {
          return
        }
        const {operator, right} = nodePath.node
        let init
        if (operator === '=') {
          init = right
        } else {
          const left = binding.path.node.init
          init = t.binaryExpression(operator.substr(0, 1), left, right)
        }
        binding.path.get('init').replaceWith(init)
        nodePath.remove()
      },
    },
  }

  return {
    visitor: {
      Program: nodePath => {
        nodePath.traverse(evaluateVisitor)
      },
      VariableDeclarator: {
        enter: nodePath => {
          nodePath.scope.crawl()
          if (nodePath.get('id').isIdentifier()) {
            const {name} = nodePath.node.id
            if (name in nodePath.scope.bindings) {
              const binding = nodePath.scope.bindings[name]
              if (binding.references === 0) {
                nodePath.remove()
              }
            }
          }
        },
      },
    },
  }
}

console.log(transform(source, {plugins: [optimizePlugin]}).code)

/* 結果:
console.log(2.5);
console.log(4.5);
*/
