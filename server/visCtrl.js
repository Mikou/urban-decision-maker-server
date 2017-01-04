const db_prefix = 'udm';
const dbConnection = require('./dbConnection');
const pgp = dbConnection.pgp;
const db = dbConnection.db;
const autobahn = require('autobahn');

var VisCtrl = {
  name: "",
  url: "",
  userId: ""
};

const _create = function (visCtrl, userId) {
  return new Promise( (resolve, reject) => {
    let query = `
      WITH user_id AS (
        SELECT id FROM udm_user WHERE id=\$1
      ), visctrl_id AS (
        INSERT INTO udm_visctrl (name, url) 
        VALUES (\$2, \$3)
        RETURNING id
      )

      INSERT INTO udm_visctrl_user (user_id, visctrl_id)
      VALUES ( (SELECT id FROM user_id), (SELECT id FROM visctrl_id) )
    `;
    db.none({
      text: query, 
      values: [userId, visCtrl.name, visCtrl.url]
    }).then( () => {
      resolve(visCtrl);
    }).catch( (err) => {
      console.log(err);
      reject(err);
    });
  });
}

const _getAll = function () {
  const query = `
    SELECT id, name, url, user_id AS userid, 'VISCTRL' AS type FROM udm_visctrl JOIN udm_visctrl_user ON udm_visctrl.id = udm_visctrl_user.visctrl_id;
  `
  return new Promise( (resolve, reject) => {
    db.any(query).then((visCtrls) => {
      resolve(visCtrls); 
    }).   catch(err => {
      reject(err);
    });
  });
}

/* AUTOBAHN API -------------------------------------------------------------*/
const create = function(args) {
  const d = new autobahn.when.defer();
  const visCtrl = args[0];
  const userId = args[1];
  _create(visCtrl, userId).then( visCtrl => {
    d.resolve(visCtrl);
  }).catch(err => {
    d.reject(err)
  })
  return d.promise;
}
/* --------------------------------------------------------------------------*/

const _publish = function (session) {
  session.register('udm.backend.createVisCtrl', create)
  console.log("TODO");
}


module.exports = {
  create: _create,
  getAll:   _getAll,
  exposeTo: _publish
};
