require('dotenv').config();

var autobahn = require('autobahn');

var pgp = require("pg-promise")(/*options*/);
var dbConnection = require('./dbConnection');
var userService = require('./user');
var widgetService = require('./widget');
var visCtrlService = require('./visCtrl');
var decisionspaceService = require('./decisionspace');
var testService = require('./test');

var db = dbConnection.db;
var logger = require('./logger');
const dummyDataService = require('./dummyData');
const debug=true;
const port = process.env.PORT;
var connection = new autobahn.Connection({
   url: 'ws://127.0.0.1:'+port+'/ws',
   realm: 'realm1'
});

var sqlFindSchema = loadSchema('../SCHEMA.sql');

function loadSchema(file) {
    return new pgp.QueryFile(file, {minify: true});
}
function dbSetup () {
  return new Promise( (resolve, reject) => { 
    db.none(sqlFindSchema).then(function (data) {
      // create a first super user
      return userService.create({
        username: "admin",
        password: "pwd",
        email: "m@m.dk",
        firstname: "bob",
        lastname: "salomon",
        roles: ["admin", "domainexpert"],
        deleted: false
      });
    }).then(function () {
      if(debug) {
        dummyDataService.create().then( () => {
          resolve();
        });
      } else {
        resolve();
      }

    }).catch(function (err) {
      console.log(err);
    });
  });
}

function server() {

  connection.onopen = function (session) {
    logger.log("CONNECTION OPENED");
    userService.exposeTo(session);
    widgetService.exposeTo(session);
    decisionspaceService.exposeTo(session);
    testService.exposeTo(session);
    //visCtrlService.exposeTo(session);


    function visCtrlRegistration(visCtrls) {
      const d = new autobahn.when.defer();
      const visCtrl = visCtrls[0];
      visCtrlService.create(db, visCtrl).then( () => {
        d.resolve("visCtrl created");
      }).catch( (err) => {
        logger.log(err);
        throw new Error(err);
      });
      return d.promise;
    }

    // produce a list of visualization controls
    function getVisCtrls () {
      var d = new autobahn.when.defer();
      visCtrlService.getAll().then( (data) => {
        d.resolve(data);
      }).catch( function (err) {
        throw new Error(err);
      });
      return d.promise;
    }


    session.register('udm.backend.visCtrlRegistration', visCtrlRegistration).then(
       function (reg) {
          logger.log("procedure visCtrlRegistration() registered");
       },
       function (err) {
          logger.log("failed to register procedure: " + err);
       }
    );

    session.register('udm.backend.getVisCtrls', getVisCtrls).then(
       function (reg) {
          logger.log("procedure getVisCtrls() registered");
       },
       function (err) {
          logger.log("failed to register procedure: " + err);
       }
    );
  };
  connection.open();
}

dbSetup().then(() => { server() });
