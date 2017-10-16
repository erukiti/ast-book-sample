const {transform} = require('babel-core')

const src = '1 + 2'

const plugin = ({types: t}) => ({
  visitor: {
    BinaryExpression: (nodePath) => {
      if (nodePath.node.operator !== '*') {
        const newAst = t.binaryExpression('*', nodePath.node.left, nodePath.node.right)
        nodePath.replaceWith(newAst)
      }
    }
  }
})

const {code} = transform(src, {plugins: [plugin]})
console.log(code) // --> 1 * 2;
