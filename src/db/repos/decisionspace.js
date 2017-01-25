const sql = require('../sql').decisionspace;
module.exports = (rep, pgp) => {
  return {
    add: decisionspace => 
      new Promise( (resolve, reject) => {
        rep.one(sql.add, decisionspace)
          .then( res => {
            decisionspace.id = res.id;
            resolve(decisionspace);
          })
          .catch( err => reject(err));
      }),
    grant: (userId, decisionspaceId) => rep.one(sql.grant, [userId, decisionspaceId]),
    remove: id => rep.one(sql.remove, id),
    retrieve: id => rep.one(sql.retrieve, id),
    retrievefull: id => new Promise( (resolve, reject) => {
      resolve(rep.one(sql.retrievefull, id));
    }),  
    revoke: (userId, decisionspaceId) => rep.one(sql.revoke, [userId, decisionspaceId]),
    update: decisionspace => rep.one(sql.update, decisionspace)
  }
}
