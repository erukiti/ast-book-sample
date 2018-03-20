const {transform} = require('@babel/core')

const plugin = {
  visitor: {
    BinaryExpression: nodePath => {
      console.log(nodePath.node.operator) // --> +
    },
  },
}

transform('1 + 2', {plugins: [plugin]})
