const plugin = ({types: t}) => {
  const toLiterals = {
    string: value => t.stringLiteral(value),
    number: value => t.numericLiteral(value),
    boolean: value => t.booleanLiteral(value),
    null: value => t.nullLiteral(),
  }

  const valueToLiteral = value => toLiterals[typeof value](value)
}
