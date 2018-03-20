const {transform} = require('@babel/core')

const src = `hoge.fuga()`

const plugin = {
  visitor: {
    CallExpression: (nodePath, state) => {
      nodePath.addComment('leading', 'hoge')
    },
  },
}

const {code} = transform(src, {plugins: [plugin]})
console.log(code)
