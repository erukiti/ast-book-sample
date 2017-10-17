const {transform} = require('babel-core')

const source = 'console.log(1)'

const insertCode = 'console.log(2)'

const plugin = ({types: t, template}) => {
  return {
    visitor: {
      Program: {
        exit: (nodePath, state) => {
          const newAst = template(insertCode)()
          nodePath.pushContainer('body', newAst)
        }
      },
    }
  }
}

console.log(transform(source, {plugins: [plugin]}).code)
// --> console.log(1);
//     console.log(2);
