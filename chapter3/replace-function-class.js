const {transform} = require('babel-core')

const source = 'class Hoge {}'

const targetId = 'Hoge'
const replaceCode = 'class Hoge{ hoge() { return "hoge" } }'

const WasCreated = Symbol('WasCreated')

const plugin = ({types: t, template}) => {
  return {
    visitor: {
      'FunctionDeclaration|ClassDeclaration': (nodePath, state) => {
        if (nodePath[WasCreated] || !t.isIdentifier(nodePath.node.id)) {
          return
        }
        if (nodePath.node.id.name === targetId) {
          const newAst = template(replaceCode)()
          nodePath.replaceWith(newAst)
          nodePath[WasCreated] = true
        }
      },
    }
  }
}

console.log(transform(source, {plugins: [plugin]}).code)
// --> class Hoge {
//       hoge() {
//         return "hoge";
//       }
//
//     }
