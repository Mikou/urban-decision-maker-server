const sql = require('../sql').user;

const userBeforeWrite = user => {
  return Object.keys(user).reduce(function(previous, current) {
    // convert array of roles to string
    previous[current] = (current == 'roles') ? user[current].toString() : user[current];
    return previous;
  }, {});
}

const userAfterRead = user => {
  return Object.keys(user).reduce(function(previous, current) {
    // convert array of roles to string
    previous[current] = (current == 'roles') ? user[current].split(",") : user[current];
    return previous;
  }, {});
}

module.exports = (rep, pgp) => {
  return {
    add: user => new Promise( (resolve, reject) => {
      user = rep.one(sql.add, userBeforeWrite(user))
      .then( res => {
        user.id = res.id;
        resolve(user);
      })
      .catch( err => reject(err) );
    }),
    remove: id => rep.one(sql.remove, id),
    retrieve: id => rep.one(sql.retrieve, id),
    retrievePrefix: username => rep.one(sql.retrieveByUsernamePrefix, username),
    login: username => new Promise( (resolve, reject) => {
      
      return rep.one(sql.retrieveByUsername, username)
        .then(user => {
          user = userAfterRead(user);
          resolve(user);
        })
        .catch( err => reject(err) );
    }),
    update : user => rep.one(sql.update, validateUser(user))
  };
}
