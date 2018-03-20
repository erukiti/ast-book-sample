const generate = require('@babel/generator').default

const ast = {
  type: 'ExpressionStatement',
  expression: {
    type: 'BinaryExpression', 
    operator: '+',
    left: {type: 'NumericLiteral', value: 1},
    right: {type: 'NumericLiteral', value: 2}
  }
}

const {code, map} = generate(ast)
console.log(code)
// 1 + 2;
