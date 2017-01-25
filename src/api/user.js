module.exports = {
  create: user => {
    const d = autobahn.when.promise;
    _udm.create(user)
        .then( user => d.resolve(user))

    return d.promise;
  },
  remove: userId => {
    const d = autobahn.when.promise;
    _udm.remove(userId)
        .then( userId => d.resolve(userId))

    return d.promise;
  },
  retrieve: id => {       
    const d = autobahn.when.promise;
    _udm.retrieve(userId)
        .then( userId => d.resolve(userId))

    return d.promise;
  },
  update: user => {
    const d = autobahn.when.promise;
    _udm.update(userId)
        .then( userId => d.resolve(userId))

    return d.promise;
  }
}
