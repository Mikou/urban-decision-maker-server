var pjson = require(__dirname + '/../package.json');
var dbConfig = require(__dirname + "/.." + pjson.dbConfig);
var pgp = require("pg-promise")(/*options*/);
var cn = "postgres://"+dbConfig.user+":"+dbConfig.password+"@"+dbConfig.host+":"+dbConfig.port+"/"+dbConfig.database;
var db = pgp(cn);

module.exports = {
  pgp: pgp,
  db:db
}
