module.exports = (_db, _udm) => {
  const repo = _db.user;
  return {
    create: user => repo.add(user),
    remove: id => repo.remove(id),
    retrieve: id => repo.retrieve(id),
    update: user => repo.update(user)
  }
}
