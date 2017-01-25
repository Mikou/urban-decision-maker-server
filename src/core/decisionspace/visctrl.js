module.exports = (_db, _udm, _decisionspace) => {
  const repo = _db.visCtrl;
  return {
    create: visCtrl => repo.add(visCtrl),
    retrieveAll: () => repo.retrieveAll(),
    withId: visCtrlId => {
      return {
        remove: () => repo.remove(visCtrlId),
        update: visCtrl => repo.update(visCtrlId, visCtrl)
      };

    }
  };
}
