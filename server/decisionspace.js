const db_prefix = 'udm';
const DecisionSpace = {
  id: null,
  name: "",
  description: "",
  userid: null,
}

const create = function (db, decisionspace) {
  const query = `
    WITH user_id AS (
      SELECT id FROM udm_user WHERE id=\${userid}
    ), decisionspace_id AS (
      INSERT INTO udm_decisionspace (name, description) 
      VALUES (\${name}, \${description})
      RETURNING id
    )

    INSERT INTO udm_decisionspace_user (user_id, decisionspace_id)
    VALUES ( (SELECT id FROM user_id), (SELECT id FROM decisionspace_id) )
  `;

  return db.none(query, decisionspace);
}

const read = function (db) {
  const query = `
    SELECT id, name, description, user_id AS userid FROM udm_decisionspace JOIN udm_decisionspace_user ON udm_decisionspace.id = udm_decisionspace_user.decisionspace_id;
  `
  return db.any(query);
}

const publish = function (session) {
  console.log("TODO");
}

module.exports = {
  create: create,
  read: read,
  exposeTo: publish
};
