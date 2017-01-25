const QueryFile = require('pg-promise').QueryFile;
const path = require('path');

const open = file => {

    const fullPath = path.join(__dirname, file); // generating full path;

    const options = {

        // minifying the SQL is always advised;
        // see also option 'compress' in the API;
        minify: true,

        // Showing how to use static pre-formatting parameters -
        // we have variable 'schema' in each SQL (as an example);
        params: {
            prefix: 'udm',// replace ${prefix~} with "udm"
            schema: 'udm' // replace ${schema~} with "udm"
        }
    };

    const qf = new QueryFile(fullPath, options);

    if (qf.error) {
        // Something is wrong with our query file :(
        // Testing each file through queries can be cumbersome,
        // so we also report it here, while loading the module:
        console.log(qf.error);
    }

    return qf;

    // See QueryFile API:
    // http://vitaly-t.github.io/pg-promise/QueryFile.html
};
module.exports = {
  util: {
    buildSchema: open('util/schema.sql')
  },
  bundle: {
    addWithVisualization: open('bundle/addWithVisualization.sql'),
    addFeature: open('bundle/addFeature.sql'),
    remove:   open('bundle/delete.sql'),
    retrieveAll: open('bundle/retrieveAll.sql'),
    update:   open('bundle/update.sql')
  },
  decisionspace: {
    add:      open('decisionspace/add.sql'),
    grant:    open('decisionspace/grant.sql'),
    remove:   open('decisionspace/delete.sql'),
    retrieve: open('decisionspace/retrieve.sql'),
    retrievefull: open('decisionspace/retrievefull.sql'),
    revoke:   open('decisionspace/revoke.sql'),
    update:   open('decisionspace/update.sql')
  },
  feature: {
    add:      open('feature/add.sql'),
    remove:   open('feature/delete.sql'),
    retrieve: open('feature/retrieve.sql'),
    update:   open('feature/update.sql')
  },
  user: {
    add:      open('user/add.sql'),
    remove:   open('user/delete.sql'),
    retrieve: open('user/retrieve.sql'),
    update:   open('user/update.sql')
  },
  visualization: {
    add:      open('visualization/add.sql'),
    remove:   open('visualization/delete.sql'),
    retrieve: open('visualization/retrieve.sql'),
    update:   open('visualization/update.sql')
  },
  visCtrl: {
    add:      open('visCtrl/add.sql'),
    remove:   open('visCtrl/delete.sql'),
    retrieveAll: open('visCtrl/retrieveAll.sql'),
    update:   open('visCtrl/update.sql')
  },
  featurectrl: {
    add:      open('featurectrl/add.sql'),
    remove:   open('featurectrl/delete.sql'),
    retrieveAll: open('featurectrl/retrieveAll.sql'),
    update:   open('featurectrl/update.sql')
  }

}
