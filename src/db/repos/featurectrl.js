const sql = require('../sql').featurectrl;
module.exports = (rep, pgp) => {
  return {
    add: (featurectrl) => new Promise( (resolve, reject) => {
      rep.one(sql.add, [featurectrl.title, featurectrl.description, featurectrl.componentType, featurectrl.author])
        .then( res => {
          featurectrl.id = res.id;
          resolve(featurectrl);
        })
        .catch( err => reject(err) );
    }),
    remove: featurectrlId => rep.one(sql.remove, featurectrlId),
    retrieveAll: () => new Promise( (resolve, reject) => {
      rep.any(sql.retrieveAll)
        .then( featurectrls => {
          resolve(featurectrls);
        })
        .catch( err => reject(err) );
    }),
    update : (featurectrlId, featurectrl) => new Promise( (resolve, reject) => {
      rep.one(sql.update, [featurectrl.id, featurectrl.title, featurectrl.description, featurectrl.componentType])
        .then( res => {
          featurectrl.id = res.id;
          resolve(featurectrl);
        })
        .catch( err => reject(err) );

    })
  }
}
