const exitVisitor = {
  File: (node, res) => res.program,
  Program: (node, res) => res.body,
  ExpressionStatement: (node, res) => {
    const expr = node.expression
    return `${getCode(node)} = ${res.expression}`
  },
  BinaryExpression: (node, res, indent) => {
    console.log(`${' '.repeat(indent)} ${res.left} ${node.operator} ${res.right}`)
    const {left, right} = res
    switch (node.operator) {
      case '+': return left + right
      case '*': return left * right
      case '-': return left - right
      case '/': return left / right
      case '%': return left % right
      default: throw new Error('対応してない二項演算子')
    }
  },
  NumericLiteral: (node, res, indent) => {
    console.log(`${' '.repeat(indent)}  value: ${node.value}`)
    return node.value
  }
}
