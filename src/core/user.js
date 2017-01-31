module.exports = (_db, _udm) => {
  const repo = _db.user;
  return {
    create: user => repo.add(user),
    login: username => repo.login(username),
    remove: id => repo.remove(id),
    retrieveById: id => repo.retrieveById(id),
    retrievePrefix: usernamePrefix => repo.retrievePrefix(usernamePrefix),
    update: user => repo.update(user)
  }
}
