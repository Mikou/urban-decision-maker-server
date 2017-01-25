const sql = require('../sql').user;

const validateUser = user => {
  return Object.keys(user).reduce(function(previous, current) {
    // convert array of roles to string
    previous[current] = (current == 'roles') ? user[current].toString() : user[current];
    return previous;
  }, {});
}

module.exports = (rep, pgp) => {
  return {
    add: user => new Promise( (resolve, reject) => {
      user = rep.one(sql.add, validateUser(user))
      .then( res => {
        user.id = res.id;
        resolve(user);
      })
      .catch( err => reject(err) );
    }),
    remove: id => rep.one(sql.remove, id),
    retrieve: id => rep.one(sql.retrieve, id),
    update : user => rep.one(sql.update, validateUser(user))
  };
}
