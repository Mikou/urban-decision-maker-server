const insertDummyData = require('./insertDummyData');
module.exports = (udm, bootOpts, db) => {
  return new Promise( (resolve, reject) => {
    if('dummyData' in bootOpts) {
      db.util.buildSchema()
        .then( () => {
          return insertDummyData(udm, bootOpts.dummyData)
        })
        .then( () => resolve() )
        .catch( err => console.log(err));
    } else {
      resolve(db.util.buildSchema());
    }
  });
}
