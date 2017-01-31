module.exports = (_db, _udm, _decisionspace, decisionspaceId) => {
  const repo = _db.bundle;
  return {
    create: bundle => repo.add(decisionspaceId, bundle),
    retrieveAll: () => repo.retrieveAll(decisionspaceId),
    withId: bundleId => {
      return {
        addFeature: featureCtrl => {
          return repo.addFeature(decisionspaceId, bundleId, featureCtrl)
        },
        remove: () => repo.remove(bundleId),
        update: decisionspace => null
      };

    }
  };
}
