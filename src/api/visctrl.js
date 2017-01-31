module.exports = (prefixes, session, autobahn, _udm) => new Promise((resolve, reject) => {
  const repo = _udm.decisionspace.visctrl;
  const create = args => {
    const d = autobahn.when.defer();
    const visctrl = args[0];
    repo.create(visctrl)
      .then( visctrl => d.resolve(visctrl))
      .catch( err => d.reject(err) );
    return d.promise;
  };
  const remove = args => {
    const d = autobahn.when.defer();
    const visctrlId = args[0];
    repo.remove(visctrlId)
      .then( visctrlId => d.resolve(visctrlId))
      .catch( err => d.reject(err) );
    return d.promise;
  };
  const retrieve = args => {
    const d = autobahn.when.defer();
    repo.retrieveAll()
      .then( res => d.resolve(res))
      .catch( err => d.reject(err));
    return d.promise;
  };
  const update = args => {
    const d = autobahn.when.defer();
    const visctrl = [0]
    repo.update(visctrl.id, visctrl)
      .then( visctrl => d.resolve(visctrl))
      .catch( err => d.reject(err) );
    return d.promise;
  };
  const prefix = prefixes.api + '.' + prefixes.domain;
  console.log("---------------------------------------------------");
  console.log("registering methods for " + prefix);
  console.log("---------------------------------------------------");
  const endpoints = [
    {name: 'create', cb: create},
    {name: 'remove', cb: remove},
    {name: 'retrieve', cb: retrieve},
    {name: 'update', cb:update}
  ];
  const promises = endpoints.map(endpoint => {
    const fqn = prefix + '.' + endpoint.name;
    console.log(fqn);
    session.register(fqn, endpoint.cb)
  })
  Promise.all(promises)
    .then(() => resolve() )
    .catch( err => reject(err));
});
