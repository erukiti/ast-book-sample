const {transform} = require('babel-core')
const syntaxTypeScript = require('babel-plugin-syntax-typescript').default

const plugin = babel => {
  return {
    inherits: syntaxTypeScript,
    visitor: {
      VariableDeclarator: (nodePath) => {
        console.log(nodePath.node.id.typeAnnotation.type) // --> TSTypeAnnotation
      },
    },
  }
}

transform('let hoge: Hoge', {plugins: [plugin]})
