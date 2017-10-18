const babylon = require('babylon')
const log = require('babel-log')
// const printAST = require('ast-pretty-print')

const ast = babylon.parse('1 + 2 * (3 + 4)')
log(ast)
// console.log(printAST(ast, true))
