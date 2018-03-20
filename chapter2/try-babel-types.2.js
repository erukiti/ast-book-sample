const {parse} = require('babylon')
const traverse = require('@babel/traverse').default
const t = require('@babel/types')

const src = '1 + 2'
const ast = parse(src)

traverse(ast, {
  BinaryExpression: (nodePath) => {
    const {left, right, operator} = nodePath.node
    if (t.isLiteral(left) && t.isLiteral(right)) {
      console.log(eval(`${left.value} ${operator} ${right.value}`))
    }
  }
})
// --> 3
