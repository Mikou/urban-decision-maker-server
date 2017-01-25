module.exports = (_db, _udm, _decisionspace) => {
  const repo = _db.featurectrl;
  return {
    create: featurectrl => repo.add(featurectrl),
    retrieveAll: () => repo.retrieveAll(),
    withId: featurectrlId => {
      return {
        remove: () => repo.remove(featurectrlId),
        update: featurectrl => repo.update(featurectrlId, featurectrl)
      };

    }
  };
}
