const {transform} = require('@babel/core')

const plugin = babel => {
  return {
    pre() {
      console.log('pre', this.constructor.name) // --> pre PluginPass 
      this.hoge = 'hoge'
    },
    visitor: {
      Program: (nodePath, state) => {
        console.log(state.constructor.name) // --> PluginPass
        console.log(state.hoge)             // --> hoge
      },
    },
  }
}

transform('1 + 2', {plugins: [plugin]})
