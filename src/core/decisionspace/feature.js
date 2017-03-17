module.exports = (_db, _udm, _decisionspace, decisionspaceId, _bundle, bundleId) => {
  const repo = _db.feature;
  return {
    add: (featureCtrl, gravity) => {
      return repo.add(decisionspaceId, bundleId, featureCtrl, gravity);
    },
    addContent: content => {
      return repo.addContent(decisionspaceId, bundleId, content);
    },
    retrieveContent: () => {
      return repo.retrieveContent(decisionspaceId, bundleId);
    },
    removeFeature: (featureId) => {
      console.log(featureId);
      return repo.removeFeature(featureId);
    }
  }
}
