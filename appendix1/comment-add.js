const {transform} = require('@babel/core')

const src = `hoge()`

const plugin = {
  visitor: {
    CallExpression: (nodePath, state) => {
      nodePath.addComment('leading', '*\n * hoge\n * fuga\n * piyo\n *')
      nodePath.addComments('trailing', [
        {type: 'CommentBlock', value: 'hoge\n\n\n\nfuga'},
      ])
    },
    ExpressionStatement: (nodePath, state) => {
      nodePath.addComments('trailing', [
        {type: 'CommentLine', value: '\n\n\n'},
        {type: 'CommentLine', value: '1'},
        {type: 'CommentLine', value: '2'},
        {type: 'CommentLine', value: '3'},
        {type: 'CommentLine', value: '4'},
      ])
    },
  },
}

const {code} = transform(src, {plugins: [plugin]})
console.log(code)
