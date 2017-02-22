var promise = require('bluebird');

// Loading all the database repositories separately,
// because event 'extend' is called multiple times:
const repos = {
  bundle:        require('./repos/bundle'),
  decisionspace: require('./repos/decisionspace'),
  feature:       require('./repos/feature'),
  user:          require('./repos/user'),
  util:          require('./repos/util'),
  visCtrl:       require('./repos/visCtrl'),
  featurectrl:   require('./repos/featurectrl'),
  visualization: require('./repos/visualization'),
};

const cn = process.env.DATABASE_URL;

// pg-promise initialization options:
const opts = {
  promiseLib: promise,
  extend: obj => {
      for (var r in repos) {
         obj[r] = repos[r](obj, pgp);
      }    
  }
};
// Load and initialize pg-promise:
const pgp = require('pg-promise')(opts);
// Create the database instance:
const db = pgp(cn);

module.exports = db
