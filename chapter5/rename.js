const {transform} = require('@babel/core')

const src = `
const hoge = () => 1

function fuga() {}

class Hoge {}
`
console.log('before:')
console.log(src.trim())

const plugin = () => {
  return {
    visitor: {
      Program: (nodePath) => {
        nodePath.scope.rename('hoge', 'hogehoge')
        nodePath.scope.rename('fuga', 'piyo')
        nodePath.scope.rename('Hoge', 'HogeHoge')
      }
    }
  }
}

const {code} = transform(src, {plugins: [plugin]})
console.log('\nafter:')
console.log(code)
