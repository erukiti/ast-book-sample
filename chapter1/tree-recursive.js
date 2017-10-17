const obj = {
  hoge: {
    fuga: [1, 2, 3]
  },
  piyo: 'ぴよ',
  foo: {
    bar: {
      baz: null
    }
  }
}

const objToString = (node, indent = 0) => {
  const leading = ' '.repeat(indent)

  if (typeof node === 'object' && node) {
    return Object.keys(node).map(key => {
      return `${leading}${key}:\n` +
             `${objToString(node[key], indent + 2)}`
    }).join('\n')
  }

  return `${leading}${node}`
}

console.log(objToString(obj))
