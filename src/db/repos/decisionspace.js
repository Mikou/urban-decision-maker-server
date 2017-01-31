const sql = require('../sql').decisionspace;
module.exports = (rep, pgp) => {
  return {
    add: decisionspace => new Promise( (resolve, reject) => {
        rep.one(sql.add, decisionspace)
          .then( res => {
            decisionspace.id = res.id;
            resolve(decisionspace);
          })
          .catch( err => reject(err));
    }),
    canAccess: (userId, decisionspaceId) => new Promise( (resolve, reject) => {
      if(userId) {
        rep.one(sql.canAccess, [userId, decisionspaceId])
          .then( res => resolve(res.exists) )
          .catch( err => reject(err) );
      } else {
        rep.one(sql.isPublic, decisionspaceId)
          .then( res => resolve(res.published) )
          .catch( err => reject(err) );
      }
    }),
    grant: (userId, decisionspaceId) => new Promise( (resolve, reject) => {
      rep.one(sql.grant, [userId, decisionspaceId])
        .then(res => resolve(res.user_id))
        .catch(err => reject(err));
    }),
    remove: id => new Promise( (resolve, reject) => {
      rep.one(sql.remove, id)
        .then(res => resolve(res.id))
        .catch(err => reject(err));
    }),
    retrieve: id => rep.one(sql.retrieve, id),
    retrieveAll: () => rep.any(sql.retrieveAll),
    retrievefull: id => new Promise( (resolve, reject) => {
      resolve(rep.one(sql.retrievefull, id));
    }),  
    revoke: (userId, decisionspaceId) => rep.one(sql.revoke, [userId, decisionspaceId]),
    update: decisionspace => rep.one(sql.update, decisionspace)
  }
}
