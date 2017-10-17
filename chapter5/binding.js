const {transform} = require('babel-core')

const src = `
const hoge = 1
console.log(hoge)

let fuga = 2
fuga += 3
console.log(fuga)
`
console.log('-----')
console.log(src.trim())
console.log('-----')

const plugin = () => {
  return {
    visitor: {
      VariableDeclarator: (nodePath) => {
        // id が Identifier であることを決め打ちしているので注意
        const {name} = nodePath.node.id
        const binding = nodePath.scope.bindings[name]
        console.log()
        console.log(`${binding.kind} ${name}`)
        console.log(`  referencese: ${binding.references}`)
        binding.referencePaths.forEach(refPath => {
          console.log(`    ${refPath.parentPath.getSource()}`)
        })
        console.log(`  constantViolations: ${binding.constantViolations.length}`)
        binding.constantViolations.forEach(vPath => {
          console.log(`    ${vPath.getSource()}`)
        })
      }
    }
  }
}

transform(src, {plugins: [plugin]})
