const autobahn = require('autobahn');
const dbConnection = require('./dbConnection');
const db_prefix = 'udm';
const pgp = dbConnection.pgp;
const db = dbConnection.db;

const hashPwd = function (pwd) {
  return pwd + "_HASHED";
}

const rolevalidation = function (r) {
    return true;//(r == "admin" || r == "member")
}

const createRole = function (name) {
  return new Promise( (resolve, reject) => {
    const query = 'INSERT INTO udm_role (name) VALUES ($1) RETURNING id';
    db.one({
      text:query,
      values: [name]
    }).then( (id) => {
      resolve(id);
    });
  });
}

const create = function (user) {
  return new Promise ((resolve, reject) => {
    if (!rolevalidation(user.roles))
      throw new Error("invalid role");
    if(user['deleted'] == undefined) user.deleted = false;
    user.password = hashPwd(user.password);
    const query = `
      INSERT INTO udm_user(username, email, password, firstname, lastname, roles, deleted) 
        VALUES (\$1, \$2, \$3, \$4, \$5, \$6, \$7)
      RETURNING id
    `;

    db.one({
      text:query,
      values: [
        user.username, 
        user.email,
        user.password,
        user.firstname,
        user.lastname,
        user.roles.toString(),
        false
      ]
    }).then( (result) => {
      user.id = result.id;
      resolve(user);
    }).catch( (err) => {
      reject(err); 
    })

  });
}

const getByUsername = function (username) {
  return new Promise ((resolve, reject) => {
    const query = 'SELECT * FROM udm_user WHERE username=$1';
    db.one({
      text:query,
      values:[username]
    }).then((user) => {
      user.roles = user.roles.split(',');
      resolve(user);
    }).catch( (err) => {
      reject("Username not valid");
    });
  });
}

const userLogin = function(args) {
  const d = new autobahn.when.defer();
  const username = args[0]['username'];
  const query = `
    SELECT * FROM `+db_prefix+`_user WHERE username=\$1
    `;
  db.one({
    text:query,
    values: [username]
  }).then( (user) => {
    user.roles = user.roles.split(",");
    d.resolve(user);
  }).catch( (err) => {
    if(err instanceof pgp.errors.QueryResultError) {
      d.reject({
        type: 'error',
        message: 'Sorry but user with name ' + username + ' does not exists.'
      });
    } else {
      d.reject({
        type: 'error',
        message: 'Unhandled error when trying to login.'
      });
    }
  });
  return d.promise;
}

const getUsers = function () {
  var d = new autobahn.when.defer();
  db.any('SELECT * FROM '+db_prefix+'_user').then( () => {
    d.resolve(users);
  });
  return d.promise;
}

const userRegistration = function (args) {
  let d = new autobahn.when.defer();
  const user = args[0];
  create(user).then( () => {
    d.resolve("user created");
  }).catch( function (err) {
    throw new Error(err);
  });
  return d.promise;
}

const _searchUsersWithPrefix = function (prefix) {
  const query = "SELECT * FROM udm_user WHERE username LIKE $1";

  return new Promise( (resolve, reject) => {
    db.any({
      text: query,
      values: [prefix + '%']
    }).then( (users) => {
      resolve(users); 
    }).catch( (err) => {
      console.log(err);
      reject(err); 
    });
  });
}

/* public autobahn methods --------------------------------------------------*/
const searchUsersWithPrefix = function (args) {
  const d = new autobahn.when.defer();
  const prefix = args[0];

  _searchUsersWithPrefix(prefix).then( users => {
    d.resolve(users); 
  }).catch( err => {
    d.reject("could not fetch the users. something went wrong"); 
  })

  return d.promise;
}

/*---------------------------------------------------------------------------*/

const publish = function (session) {
  session.register('udm.backend.getUsers', getUsers).then(
     function (reg) {
        console.log("procedure loginUser() registered");
     },
     function (err) {
        console.log("failed to register procedure: " + err);
     }
  );
  session.register('udm.backend.userLogin', userLogin).then(
     function (reg) {
        console.log("procedure loginUser() registered");
     },
     function (err) {
        console.log("failed to register procedure: " + err);
     }
  );
  session.register('udm.backend.userRegistration', userRegistration).then(
     function (reg) {
        console.log("procedure createUser() registered");
     },
     function (err) {
        console.log("failed to register procedure: " + err);
     }
  );
  session.register('udm.backend.searchUsersWithPrefix', searchUsersWithPrefix).then(
     function (reg) {
        console.log("procedure createUser() registered");
     },
     function (err) {
        console.log("failed to register procedure: " + err);
     }
  );
}

module.exports = {
  create: create,
  getByUsername: getByUsername,
  createRole: createRole,
  exposeTo: publish
}
