const {transform} = require('@babel/core')

const opts = {
  replace: {
    'const hoge =': '"const hoge replaced"',
    'function fuga': 'function fuga() {console.log("function fuga replaced")}',
    'class Piyo': `
      class Piyo {
        constructor() {
          console.log('class Piyo replaced')
        }
        get() {
          return 'piyo'
        }
      }
    `,
  },
  insert: {
    last: 'module.exports.Piyo = Piyo',
  },
}

const src = `
const hoge = 'hoge'

console.log(hoge)

function fuga() {
    console.log('fuga')
}

fuga()

class Piyo {
    constructor() {
        console.log('piyo')
    }

    get() {
        return null
    }
}
`

console.log('before:')
console.log(src)

const {code} = transform(src, {
  plugins: [[require('./babel-plugin-di.js'), opts]],
})
console.log('\nafter:')
console.log(code)
