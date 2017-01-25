const sql = require('../sql').util;
module.exports = (rep, pgp) => {
  return {
    buildSchema: () => rep.none(sql.buildSchema)
  }
};
