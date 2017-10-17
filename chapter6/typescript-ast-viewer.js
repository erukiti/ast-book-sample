const {transform} = require('babel-core')
const syntaxTypeScript = require('babel-plugin-syntax-typescript').default

const src = 'const hoge: Fraction'

const replacer = (key, value) => {
  return ['start', 'end', 'loc'].indexOf(key) !== -1 ? undefined : value
}

const plugin = {
  inherits: syntaxTypeScript,
  visitor: {
    VariableDeclarator: (nodePath) => {
      console.log(JSON.stringify(nodePath.node.id, replacer,  '  '))
    }
  }
}

transform(src, {plugins: [plugin]})
