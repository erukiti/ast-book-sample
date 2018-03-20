const {transform} = require('@babel/core')

const plugin = babel => {
  return {
    pre() {
      this.hoge = 'hoge'
    },
    visitor: {
      Program: (nodePath, state) => {
        nodePath.traverse({
          BinaryExpression: (innerPath, innerState) => {
            console.log('inner', innerState) // --> {fuga: 'FUGA'}
          }
        }, {fuga: 'FUGA'})
        console.log(state.constructor.name) // --> PluginPass
        console.log(state.hoge)             // --> hoge
      },
    },
  }
}

transform('1 + 2', {plugins: [plugin]})
