const prettier = require('prettier')
const {transformFromAst} = require('babel-core')

const rawAst = {
  type: 'Program',
  body: [{
    type: 'ExpressionStatement',
    expression: {
      type: 'BinaryExpression', 
      operator: '+',
      left: {type: 'NumericLiteral', value: 1, extra: {raw: '1'}},
      right: {type: 'NumericLiteral', value: 2, extra: {raw: '2'}},
    }
  }]
}

const {ast} = transformFromAst(rawAst)

const code = prettier.format('dummy', {
  semi: false,
  singleQuote: true,
  parser(text) {
    return ast
  }
})

console.log(code)
// 1 + 2
