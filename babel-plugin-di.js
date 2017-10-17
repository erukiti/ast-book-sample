const {parseExpression} = require('babylon')

const WasCreated = Symbol('WasCreated')

const plugin = ({types: t, template, version}) => {
  const visitor = {
    Program: {
      exit: (nodePath, state) => {
        if (state.inserters.last) {
          const newAst = template(state.inserters.last)()
          nodePath.pushContainer('body', newAst)
        }
      },
    },
    VariableDeclarator: (nodePath, state) => {
      const {kind} = nodePath.parent

      if (t.isIdentifier(nodePath.node.id)) {
        const replaceCode =
          state.replacers[`${kind} ${nodePath.node.id.name} =`]
        if (replaceCode) {
          const newAst = parseExpression(replaceCode)
          nodePath.get('init').replaceWith(newAst)
        }
      }
    },
    'FunctionDeclaration|ClassDeclaration': (nodePath, state) => {
      if (nodePath[WasCreated] || !t.isIdentifier(nodePath.node.id)) {
        return
      }
      const optId = {
        FunctionDeclaration: 'function',
        ClassDeclaration: 'class',
      }

      const replaceCode =
        state.replacers[`${optId[nodePath.type]} ${nodePath.node.id.name}`]
      if (replaceCode) {
        const newAst = template(replaceCode)()
        nodePath.replaceWith(newAst)
        nodePath[WasCreated] = true
      }
    },
  }

  return {
    name: 'dependency-injection',
    visitor,
    pre() {
      this.inserters = Object.assign({}, this.opts.insert)
      this.replacers = Object.assign({}, this.opts.replace)
    },
  }
}

module.exports = plugin
