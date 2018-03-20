const {transform} = require('@babel/core')

const plugin = babel => {
  const {traverse, types: t, template, version} = babel
  console.log(version)                        // --> 7.0.0-beta.3

  return {
    visitor: {
      BinaryExpression: nodePath => {
        console.log(t.isExpression(nodePath)) // --> true
        console.log(nodePath.node.operator)   // --> +
      },
    },
  }
}

transform('1 + 2', {plugins: [plugin]})
