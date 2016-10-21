const autobahn = require('autobahn');
const dbConnection = require('./dbConnection');
const db_prefix = 'udm';
const db = dbConnection.db;
const User = {
  username: "",
  password: "",
  firstname: "",
  lastname: "",
  roles: [],
  deleted: false
}

const userschema = `
  CREATE TABLE ` + db_prefix + `_user (
    id SERIAL   PRIMARY KEY,
    username    varchar (50)  NOT NULL,
    firstname   varchar (50)  NOT NULL,
    lastname    varchar (50)  NOT NULL,
    email       varchar (50)  NOT NULL,
    password    char    (128) NOT NULL,
    roles       varchar (50)  NOT NULL,
    deleted     boolean       NOT NULL DEFAULT FALSE
  );
`

const hashPwd = function (pwd) {
  return pwd + "_HASHED";
}

const rolevalidation = function (r) {
    return true;//(r == "admin" || r == "member")
}

const create = function (user) {
  if (!rolevalidation(user.roles))
    throw new Error("invalid role");
  if(user['deleted'] == undefined) user.deleted = false;
  user.password = hashPwd(user.password);
  return db.none('INSERT INTO '+db_prefix+'_user(username, email, password, firstname, lastname, roles, deleted) VALUES (${username}, ${email}, ${password}, ${firstname}, ${lastname}, ${roles}, ${deleted})', user);
}

const read = function (username) {
  if(username) {
    return db.one('SELECT * FROM '+db_prefix+'_user WHERE username=\''+username+'\'');
  } else {
    return db.any('SELECT * FROM '+db_prefix+'_user');
  }
}

const userLogin = function(candidateUser) {
  const d = new autobahn.when.defer();
  read(candidateUser[0]["username"]).then( (users) => {
    d.resolve(users);
  }).catch( (err) => {
    console.log(err);
  })
  return d.promise;
}

const getUsers = function () {
  var d = new autobahn.when.defer();
  read().then( (users) => {
    d.resolve(users);
  });
  return d.promise;
}

const userRegistration = function (users) {
  let d = new autobahn.when.defer();
  const user = users[0];
  create(user).then( () => {
    d.resolve("user created");
  }).catch( function (err) {
    throw new Error(err);
  });
  return d.promise;
}

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
}

module.exports = {
  userschema: userschema,
  create: create,
  read: read,
  exposeTo: publish
}
