let globalSession = null;

const ping = function (args) {
  const session = globalSession;
  console.log(args);
  setTimeout( () => {
    session.publish('udm.frontend.test', ['Hi frontend']);
  },1000);
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
