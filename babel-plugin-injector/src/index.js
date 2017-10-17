const babylon = require('babylon')

const WasCreated = Symbol('WasCreated')

export default ({types: t, template}) => {
  const visitor = {
    Program: {
      exit: (nodePath, state) => {
        if (state.opts.insert.last) {
          nodePath.pushContainer('body', template(state.opts.insert.last)())
        }
      }
    },
    VariableDeclarator: (nodePath, state) => {
      const {kind} = nodePath.parent

      if (t.isIdentifier(nodePath.node.id)) {
        const replaceCode = state.opts.replace[`${kind} ${nodePath.node.id.name} =`]
        if (replaceCode) {
          nodePath.get('init').replaceWith(template(replaceCode)())
        }
      }
    },
    'FunctionDeclaration|ClassDeclaration': (nodePath, state) => {
      if (nodePath[WasCreated] || !t.isIdentifier(nodePath.node.id)) {
        return
      }
      const optId = {
        FunctionDeclaration: 'function',
        ClassDeclaration: 'class'
      }

      const replaceCode = state.opts.replace[`${optId[nodePath.type]} ${nodePath.node.id.name}`]

      if (replaceCode) {
        nodePath.replaceWith(template(replaceCode)())
      }
    },
  }

  return {
    name: 'babel-plugin-injector',
    pre() {
      if (!('opts' in this)) {
        this.opts = {replace: {}, insert: {}}
        return
      }
      if (!('replace' in this.opts)) {
        this.opts.replace = {}
      }
      if (!('insert' in this.opts)) {
        this.opts.insert = {}
      }
    },
    visitor,
  }
}
