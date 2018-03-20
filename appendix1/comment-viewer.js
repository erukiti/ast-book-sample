const {transform} = require('@babel/core')

// const src = ......

const plugin = {
  visitor: {
    Program: (nodePath, state) => {
      nodePath.traverse({
        enter: (innerPath) => {
          const {leadingComments, trailingComments, type} = innerPath.node
          if (leadingComments || trailingComments) {
            console.log(`${type}: ${innerPath.getSource()}`)
            if (leadingComments) {
              console.log(`  leading:  ${leadingComments.map(n => n.value).join(', ')}`)
            }
            if (trailingComments) {
              console.log(`  trailing: ${trailingComments.map(n => n.value).join(', ')}`)
            }
          }
        }
      })
    }
  }
}

transform(src, {plugins: [plugin]})
