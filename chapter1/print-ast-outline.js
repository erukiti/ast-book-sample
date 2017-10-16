const babylon = require('babylon')

const ast = babylon.parse('1 + 2 * (3 + 4)')

const isNode = obj => {
  // NodeもしくはNodeの配列は必ず object 型です。
  if (typeof obj !== 'object') {
    return false
  }

  // 配列の中にNodeが含まれていれば、配列自体をNode型と判定します。
  if (Array.isArray(obj)) {
    return obj.find(v => isNode(v)) !== undefined
  }

  return obj && 'constructor' in obj && obj.constructor.name === 'Node'
}

const replacer = (key, value) => {
  if (!key || key === 'type' || isNode(value)) {
    return value
  }

  return undefined
}

console.log(JSON.stringify(ast, replacer, '  '))
