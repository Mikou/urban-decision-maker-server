module.exports = opts => {
  const autobahn = require('autobahn');
  const udm = require('../core');
  const port = process.env.PORT;
  const connection = new autobahn.Connection({
     url: 'ws://127.0.0.1:'+port+'/ws',
     realm: 'realm1'
  });

  const domains = [
    {name: 'user', fn: require('./user')},
    {name: 'bundle', fn: require('./bundle')},
    {name: 'visctrl', fn: require('./visctrl')},
    {name: 'featurectrl', fn: require('./featurectrl')},
    {name: 'decisionspace', fn: require('./decisionspace')}
  ];

  const apiPrefix = 'backend';
  connection.onopen = session => {
    const promises = domains.map( domain => {
      const prefixes = {api: apiPrefix, domain:domain.name};
      domain.fn(prefixes, session, autobahn, udm)
    });
  };

  connection.open();

  return new Promise( (resolve, reject) => {
    udm.boot(opts)
      .then( () => resolve() )
      .catch( err => reject(err) );
  });
}
