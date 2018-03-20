const {transform} = require('@babel/core')

const WasCreated = Symbol('WasCreated')

const optimizePlugin = ({types: t}) => {
  const evaluateVisitor = {
    exit: (nodePath) => {
      if (t.isImmutable(nodePath.node) || nodePath[WasCreated]) {
        return
      }

      const {confident, value} = nodePath.evaluate()
      if (confident) {
        nodePath.replaceWith(t.valueToNode(value))
        nodePath[WasCreated] = true
      }
    },
  }

  return {
    visitor: {
      Program: (nodePath) => {
        nodePath.traverse(evaluateVisitor)
      },
    }
  }
}

const source = `
const a = 1 + 2 * 3 / 4
console.log(a)
let b = a + 2
console.log(b)
`

const {code} = transform(source, {plugins: [optimizePlugin]})
console.log(code)

/* 結果:
const a = 2.5;
console.log(2.5);
let b = 4.5;
console.log(4.5);
*/
