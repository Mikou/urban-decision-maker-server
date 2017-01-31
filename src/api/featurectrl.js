module.exports = (prefixes, session, autobahn, _udm) => new Promise((resolve, reject) => {
  const repo = _udm.decisionspace.featurectrl;
  const create = args => {
    const d = autobahn.when.defer();
    const featurectrl = args[0];
    repo.create(featurectrl)
      .then( featurectrl => d.resolve(featurectrl))
      .catch( err => d.reject(err) );
    return d.promise;
  };
  const remove = args => {
    const d = autobahn.when.defer();
    const featurectrlId = args[0];
    repo.remove(featurectrlId)
      .then( featurectrlId => d.resolve(featurectrlId))
      .catch( err => d.reject(err) );
    return d.promise;
  };
  const retrieve = args => {
    const d = autobahn.when.defer();
    //const featurectrlId = args[0];
    repo.retrieveAll()
      .then( res => {
        d.resolve(res)
      })
      .catch( err => {
        console.log(err);
        d.reject(err) 
      });
    return d.promise;
  };
  const update = args => {
    const d = autobahn.when.defer();
    const featurectrl = [0]
    repo.update(featurectrl.id, featurectrl)
      .then( featurectrl => d.resolve(featurectrl))
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
