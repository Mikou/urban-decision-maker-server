const dbConnection = require('./dbConnection');
const pgp = dbConnection.pgp;
const db = dbConnection.db;
const db_prefix = 'udm';
const autobahn = require('autobahn');

const _getDecisionspaceById = function (id) {
  const query = `
    SELECT id, name, description, user_id AS userid 
      FROM udm_decisionspace 
    JOIN udm_decisionspace_user 
      ON udm_decisionspace.id = udm_decisionspace_user.decisionspace_id
    WHERE udm_decisionspace.id=\$1;
  `;

  return new Promise( (resolve, reject) => {
    db.one({
      text:query,
      values: [id]
    }).then( (res) => {
      resolve(res);
    }).catch( (err) => {
      console.log(err);
      reject(err);
    })
  });
};

const _create = function (decisionspace) {
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
    RETURNING (SELECT id FROM decisionspace_id)
  `;

  return new Promise( (resolve, reject) => {
    db.one(query, decisionspace).then( (result) => {
      decisionspace.id = result.id;
      resolve(decisionspace);
    }).catch( function (err) {
      console.log(err);
      reject('could not create the decisionspace');
    });
  });
}

const _getList = function(user) {
  const query = `
    SELECT id, name, description, user_id AS userid 
    FROM udm_decisionspace 
    JOIN udm_decisionspace_user 
    ON udm_decisionspace.id = udm_decisionspace_user.decisionspace_id;
  `;

  return new Promise( (resolve, reject) => {
    /*if(!user) {
      reject("you must be connected");
    }*/
    db.any(query).then( (data) => {
      resolve(data);
    }).catch( function (err) {
      console.log(err);
      reject('could not fetch the list of decisionspaces');
    });
  });
}

/* PUBLIC AUTOBAHN ENDPOINTS ------------------------------------------------*/
const create = function (args) {
  const d = new autobahn.when.defer();
  const decisionspace=args[0];
  _create(decisionspace).then( decisionspace => {
    d.resolve(decisionspace);
  }).catch( err => {
    d.reject(err); 
  })
  return d.promise;
}

const getDecisionspaceById = function (args) {
  const d = new autobahn.when.defer();
  const id = args[0];
  _getDecisionspaceById(id).then( (decisionspace) => {
    d.resolve(decisionspace);
  }).catch( (err) => {
    d.reject(decisionspace); 
  })
  return d.promise;
}

const getList = function (args) {
  const d = new autobahn.when.defer();
  _getList(args[0]).then( (res) => {
    d.resolve(res);
  }).catch( (err) => {
    d.reject(err);
  });
  return d.promise;
}
/*---------------------------------------------------------------------------*/

const publish = function (session) {
  session.register('udm.backend.decisionspaceRegistration', create).then(
     function (reg) {
       console.log("procedure decisionspaceRegistration() registered");
     },
     function (err) {
       console.log("failed to register procedure: " + err);
     }
  );

  session.register('udm.backend.decisionspaceList', getList).then(
     function (reg) {
       console.log("procedure decisionspaceList() registered");
     },
     function (err) {
       console.log("failed to register procedure: " + err);
     }
  );

  session.register('udm.backend.getDecisionspaceById', getDecisionspaceById).then(
    function (reg) {
     console.log("procedure getDecisionspaceById() registered");
    },
    function (err) {
      console.log("failed to register procedure: " + err);
    }  
  );
}

module.exports = {
  exposeTo: publish,
  create: _create
};
