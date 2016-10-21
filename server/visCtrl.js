var db_prefix = 'udm';

var VisCtrl = {
  name: "",
  url: "",
  userId: ""
};

const create = function (db, visCtrl) {
  let query = `
    WITH user_id AS (
      SELECT id FROM udm_user WHERE id=\${userid}
    ), visctrl_id AS (
      INSERT INTO udm_visctrl (name, url) 
      VALUES (\${name}, \${url})
      RETURNING id
    )

    INSERT INTO udm_visctrl_user (user_id, visctrl_id)
    VALUES ( (SELECT id FROM user_id), (SELECT id FROM visctrl_id) )
  `;
  return db.none(query, visCtrl);
}

const read = function (db) {
  const query = `
    SELECT id, name, url, user_id AS userid, 'visItem' AS type FROM udm_visctrl JOIN udm_visctrl_user ON udm_visctrl.id = udm_visctrl_user.visctrl_id;
  `
  return db.any(query);
}

const publish = function (session) {
  console.log("TODO");
}

module.exports = {
  create: create,
  read:   read,
  exposeTo: publish
};
