module.exports = (_db, _udm) => {
  const repo = _db.feature;
  return {
    addFeatureContentType: (contentType) => repo.addFeatureContentType(contentType),
    addComponentType: (componentType, input, output) => repo.addComponentType(componentType, input, output)
  }
}
