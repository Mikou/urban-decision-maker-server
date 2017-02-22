const sql = require('../sql');
module.exports = (rep, pgp) => {
  return {
    add: (decisionspaceId, bundle) => new Promise( (resolve, reject) => {
      rep.one(sql.bundle.addWithVisualization, [bundle.title, bundle.description, bundle.published, decisionspaceId, bundle.author, bundle.visualization.url])
        .then( res => {
          bundle.id = res.id
          resolve(bundle); 
        })
        .catch( err => reject(err) );
    }),
    remove: bundleId => rep.one(sql.bundle.remove, bundleId),
    retrieveAll: (decisionspaceId) => new Promise( (resolve, reject) => {
      rep.any(sql.bundle.retrieveAll, [decisionspaceId])
        .then( bundles => {
          resolve(bundles);
        })
        .catch( err => reject(err) );
    }),
    update : (id) => new Promise( (resolve, reject) => {
      reject("Not yet implemented");
    })
  }
}
