const dbConnection = require('./dbConnection');
const pgp = dbConnection.pgp;
const db = dbConnection.db;
const db_prefix = 'udm';
const autobahn = require('autobahn');
const userService = require('./user.js');
const postmark = require("postmark")(process.env.POSTMARK_API_TOKEN)

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

const _authorize = function (userId, decisionspaceId) {
  console.log(userId, decisionspaceId);
  const query = `
    WITH user_id AS (
      SELECT id FROM udm_user WHERE id=\$1    
    ), decisionspace_id AS (
      SELECT id FROM udm_decisionspace WHERE id=\$2    
    )
    INSERT INTO udm_permission_decisionspace_user (user_id, decisionspace_id)
    VALUES ( (SELECT id FROM user_id), (SELECT id FROM decisionspace_id) )
  `;

  return new Promise( (resolve, reject) => {
    db.none({
      text:query,
      values:[userId, decisionspaceId]
    })
    .then( () => resolve() )
    .catch( err => reject(err) );
  });
  
}

const _create = function (decisionspace) {
  const query = `
    WITH user_id AS (
      SELECT id FROM udm_user WHERE id=\${userid}
    ), decisionspace_id AS (
      INSERT INTO udm_decisionspace (name, description, published) 
      VALUES (\${name}, \${description}, \${published})
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

const _getDecisionspaces = function(user) {
  let filter = "";
  if(!user) {
    filter = ' WHERE published = true';
  }
  let query = `
    SELECT id, name, description, published, user_id AS userid 
    FROM udm_decisionspace 
    JOIN udm_decisionspace_user 
    ON udm_decisionspace.id = udm_decisionspace_user.decisionspace_id
  `;

  query = query + filter;

  return new Promise( (resolve, reject) => {
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
  const user = args[0];
  _getDecisionspaceById(user).then( (decisionspace) => {
    d.resolve(decisionspace);
  }).catch( (err) => {
    d.reject(decisionspace); 
  })
  return d.promise;
}

const getDecisionspaces = function (args) {
  const d = new autobahn.when.defer();
  _getDecisionspaces(args[0]).then( (res) => {
    d.resolve(res);
  }).catch( (err) => {
    d.reject(err);
  });
  return d.promise;
}

const inviteUserWithUsername = function (args) {
  const d = new autobahn.when.defer();
  const username = args[0];
  const decisionspaceId = args[1];
  const href = args[2];

  const p1 = _getDecisionspaceById(decisionspaceId);
  const p2 = userService.getByUsername(username);

  Promise.all([p1, p2]).then( (data) => {
    const decisionspace = data[0];
    const invitedUser = data[1];
    console.log("-> USER INVITED", data);
    /*postmark.send({
      "From": "mjes@itu.dk",
      "To": invitedUser.email,
      "Subject": "Invitation",
      "TextBody": "You have been invited into the decision space:\"" + decisionspace.name + "\".\n Click the following link to join: " + href,
      "Tag": "invitation"
    }, function(error, success) {
      if(error) {
          console.error("Unable to send via postmark: " + error.message);
         d.reject(error.message);
         return;
      }
      d.resolve(invitedUser);
      console.info("Sent to postmark for delivery")
    });*/
    d.resolve(invitedUser);
  })
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
  session.register('udm.backend.getDecisionspaces', getDecisionspaces).then(
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
  session.register('udm.backend.inviteUserWithUsername', inviteUserWithUsername).then(
     function (reg) {
        console.log("procedure inviteUserWithUsername() registered");
     },
     function (err) {
        console.log("failed to register procedure: " + err);
     }
  );
}

module.exports = {
  exposeTo: publish,
  create: _create,
  authorize: _authorize
};
