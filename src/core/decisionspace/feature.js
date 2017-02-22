module.exports = (_db, _udm, _decisionspace, decisionspaceId, _bundle, bundleId) => {
  const repo = _db.feature;
  return {
    add: feature => {
      return repo.add(decisionspaceId, bundleId, feature);
    },
    addContent: content => {
      return repo.addContent(decisionspaceId, bundleId, content);
    },
    retrieveContent: () => {
      return repo.retrieveContent(decisionspaceId, bundleId);
    }
  }
}
