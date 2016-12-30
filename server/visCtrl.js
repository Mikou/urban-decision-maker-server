const db_prefix = 'udm';
const dbConnection = require('./dbConnection');
const pgp = dbConnection.pgp;
const db = dbConnection.db;

var VisCtrl = {
  name: "",
  url: "",
  userId: ""
};

const create = function (visCtrl) {
  return new Promise( (resolve, reject) => {
    let query = `
      WITH user_id AS (
        SELECT id FROM udm_user WHERE id=\${userId}
      ), visctrl_id AS (
        INSERT INTO udm_visctrl (name, url) 
        VALUES (\${name}, \${url})
        RETURNING id
      )

      INSERT INTO udm_visctrl_user (user_id, visctrl_id)
      VALUES ( (SELECT id FROM user_id), (SELECT id FROM visctrl_id) )
    `;
    db.none(query, visCtrl).then( () => {
      resolve();
    }).catch( (err) => {
      console.log(err);
      reject(err);
    });
  });
}

const getAll = function () {
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

const publish = function (session) {
  console.log("TODO");
}

module.exports = {
  create: create,
  getAll:   getAll,
  exposeTo: publish
};
