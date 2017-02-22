module.exports = (_db, _udm, _decisionspace, decisionspaceId) => {
  const services = {
    feature: require('./feature')
  };

  const repo = _db.bundle;
  const _bundle = {
    create: bundle => repo.add(decisionspaceId, bundle),
    retrieveAll: () => repo.retrieveAll(decisionspaceId),
    withId: bundleId => {
      return {
        feature: services.feature(_db, _udm, _decisionspace, decisionspaceId, _bundle, bundleId),
        remove: () => repo.remove(bundleId),
        update: decisionspace => null,
      };
    }
  };

  return _bundle;
}
