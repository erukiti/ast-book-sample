const evaluateVisitor = {
  exit: (nodePath) => {
    // 一度変換したやつやそもそも変換できないものはいじらない
    if (t.isImmutable(nodePath.node)) {
      return
    }

    const {confident, value} = nodePath.evaluate()
    if (confident && typeof value !== 'object') {
      nodePath.replaceWith(valueToLiteral(value))
    }
  },
}
