const {transform} = require('babel-core')

const sourceCode = '1 + 2'
const opts = {plugins: []}

const {code, ast, map} = transform(sourceCode, opts)
// code: 変換後のソースコード
// ast: 変換後のAST
// map: ソースマップ