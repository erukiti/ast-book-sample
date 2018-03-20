const prettier = require('prettier')
const {transform} = require('@babel/core')

const src = 'console.log("hoge");'

const code = prettier.format(src, {
  semi: false,
  singleQuote: true,
  parser(text) {
    const {ast} = transform(text, {plugins: []})
    return ast
  }
})

console.log(code)
// --> console.log('hoge')
