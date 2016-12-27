let globalSession = null;
const autobahn = require('autobahn');

const ping = function (args) {
  const d = new autobahn.when.defer();
  const session = globalSession;
  d.resolve("ping reveived at " + new Date());
  console.log(args);
  return d.promise;
}

const publish = function (session) {
  globalSession = session;
  session.register('udm.backend.test', ping).then(
    function (reg) {
      console.log("procedure test() registered");
    },
    function (err) {
      console.log("failed to register procedure: " + err);
    }
  );
}

module.exports = {
  exposeTo: publish
};
