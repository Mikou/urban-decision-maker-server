const sql = require('../sql');
module.exports = (rep, pgp) => {
  return {
    add: (decisionspaceId, bundle) => 
      rep.one(sql.bundle.addWithVisualization, [bundle.title, bundle.description, bundle.published, decisionspaceId, bundle.author, bundle.visualization.url])
        .then( res => {
          bundle.id = res.id
          return bundle;
        }),
    remove: bundleId => rep.one(sql.bundle.remove, bundleId),
    retrieveAll: (decisionspaceId) => 
      rep.any(sql.bundle.retrieveAll, [decisionspaceId]),
    update : (id) => new Promise( (resolve, reject) => {
      reject("Not yet implemented");
    })
  }
}
