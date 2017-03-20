module.exports = (prefixes, session, autobahn, _udm) => new Promise((resolve, reject) => {
  const repo = _udm.decisionspace;
  const create = args => {
    const d = autobahn.when.defer();
    const user = args[0];
    const decisionspace = args[1];
    repo.create(decisionspace)
      .then( decisionspace => d.resolve(decisionspace))
      .catch( err => d.reject(err) );
    return d.promise;
  };
  const canAccess = args => {
    const d = autobahn.when.defer();
    const user = args[0];
    const decisionspaceId = args[1];
    const userId = (user) ? user.id : null;
    repo.withId(decisionspaceId).canAccess(userId)
      .then( canAccess => d.resolve(canAccess))
      .catch( err => d.reject(err) );
    return d.promise;
  };
  const remove = args => {
    const d = autobahn.when.defer();
    const user = args[0];
    const decisionspaceId = args[1];
    repo.withId(decisionspace).remove()
      .then( decisionspaceId => d.resolve(decisionspaceId))
      .catch( err => d.reject(err) );
    return d.promise;
  };
  const retrieve = args => {
    const d = autobahn.when.defer();
    const user = args[0];
    const decisionspaceId = args[1];
    const full = args[2];
      if(decisionspaceId) {
        if(full) {
          repo.withId(decisionspaceId).retrievefull()
            .then( decisionspace => d.resolve(decisionspace))
            .catch( err => d.reject(err) );
        } else {
          repo.withId(decisionspaceId).retrieve()
            .then( decisionspace => d.resolve(decisionspace))
            .catch( err => d.reject(err) );
        }
      } else {
        repo.retrieve()
          .then( decisionspaces => d.resolve(decisionspaces) )
          .catch( err => d.reject(err) );
      }
    return d.promise;
  };
  const update = args => {
    const d = autobahn.when.defer();
    const user = args[0];
    const decisionspace = args[1];
    repo.withId(decisionspace.id).update(decisionspace)
      .then( decisionspace => d.resolve(decisionspace))
      .catch( err => {
        console.log(err);
        d.reject(err) });
    return d.promise;
  };
  const prefix = prefixes.api + '.' + prefixes.domain;
  console.log("---------------------------------------------------");
  console.log("registering methods for " + prefix);
  console.log("---------------------------------------------------");
  const endpoints = [
    {name: 'create', cb: create},
    {name: 'canAccess', cb: canAccess},
    {name: 'remove', cb: remove},
    {name: 'retrieve', cb: retrieve},
    {name: 'update', cb:update}
  ];
  const promises = endpoints.map(endpoint => {
    const fqn = prefix + '.' + endpoint.name;
    //console.log(fqn);
    session.register(fqn, endpoint.cb)
  })
  Promise.all(promises)
    .then( () => resolve() )
    .catch( err => reject(err));
});
