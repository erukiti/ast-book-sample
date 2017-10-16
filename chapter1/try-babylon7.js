const babylon = require('babylon')

const ast = babylon.parse('1 + 2 * (3 + 4)')
console.log(ast)

/* 結果
Node {
  type: 'File',
  start: 0,
  end: 15,
  loc: 
   SourceLocation {
     start: Position { line: 1, column: 0 },
     end: Position { line: 1, column: 15 } },
  program: 
   Node {
     type: 'Program',
     start: 0,
     end: 15,
     loc: SourceLocation { start: [Object], end: [Object] },
     sourceType: 'script',
     body: [ [Object] ],
     directives: [] },
  comments: [] }
*/
