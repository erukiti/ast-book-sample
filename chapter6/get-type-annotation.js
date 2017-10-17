const getTypeAnnotation = nodePath => {
  if (!t.isIdentifier(nodePath.node)) {
    return null
  }

  const binding = nodePath.scope.bindings[nodePath.node.name]

  if(!binding || !('typeAnnotation' in binding.identifier)) {
    return null
  }
  const {identifier} = binding

  if (identifier.typeAnnotation.type === 'TypeAnnotation' &&
      identifier.typeAnnotation.typeAnnotation.type === 'GenericTypeAnnotation' &&
      t.isIdentifier(identifier.typeAnnotation.typeAnnotation.id)
  ) {
    return identifier.typeAnnotation.typeAnnotation.id.name
  }

  if (identifier.typeAnnotation.type === 'TSTypeAnnotation' &&
      identifier.typeAnnotation.typeAnnotation.type === 'TSTypeReference' &&
      t.isIdentifier(identifier.typeAnnotation.typeAnnotation.typeName)
  ) {
    return identifier.typeAnnotation.typeAnnotation.typeName.name
  }

  return null
}
