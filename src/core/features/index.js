module.exports = (_db, _udm) => {
  const services = {
    feature: require('./feature'),
    featurectrl: require('./featurectrl'),
    bundle: require('./bundle'),
    visctrl: require('./visctrl'),
    visualization: require('./visualization')
  };
  const repo = _db.decisionspace;
  const decisionspace = {
    create: decisionspace => repo.add(decisionspace),
    retrieve: () => repo.retrieveAll(),
    visctrl: services.visctrl(_db, _udm),
    featurectrl: services.featurectrl(_db, _udm),
    withId: decisionspaceId => {
      return {
        bundle: services.bundle(_db, _udm, decisionspace, decisionspaceId),
        visualization: services.visualization(_db, _udm, decisionspace, decisionspaceId),
        canAccess: userId => repo.canAccess(userId, decisionspaceId),
        grant: userId => repo.grant(userId, decisionspaceId),
        remove: () => repo.remove(decisionspaceId),
        retrieve: () => repo.retrieve(decisionspaceId),
        retrievefull: () => repo.retrievefull(decisionspaceId),
        revoke: userId => repo.revoke(userId, decisionspaceId),
        update: decisionspace => {
          if(decisionspace.id != decisionspaceId)
            throw new Error("The instance does not match the decision space to update!");
          return repo.update(decisionspace);
        }
      };
    }
  }
  return decisionspace;
}
