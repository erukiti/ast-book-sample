const t = require('@babel/types')
const generate = require('@babel/generator').default

const ast = t.binaryExpression('*', t.numericLiteral(1), t.numericLiteral(2))
const {code} = generate(ast)
console.log(code) // --> 1 * 2
