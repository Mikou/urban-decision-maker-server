const sql = require('../sql').visCtrl;
module.exports = (rep, pgp) => {
  return {
    add: (visCtrl) => new Promise( (resolve, reject) => {
      rep.one(sql.add, [visCtrl.title, visCtrl.description, visCtrl.url, visCtrl.author])
        .then( res => {
          visCtrl.id = res.id;
          resolve(visCtrl);
        })
        .catch( err => reject(err) );
    }),
    remove: visctrlId => rep.one(sql.remove, visctrlId),
    retrieveAll: () => new Promise( (resolve, reject) => {
      rep.any(sql.retrieveAll)
        .then( visCtrls => {
          resolve(visCtrls);
        })
        .catch( err => reject(err) );
    }),
    update : (visCtrlId, visCtrl) => new Promise( (resolve, reject) => {
      rep.one(sql.update, [visCtrl.id, visCtrl.title, visCtrl.description, visCtrl.url])
        .then( res => {
          visCtrl.id = res.id;
          resolve(visCtrl);
        })
        .catch( err => reject(err) );

    })
  }
}
