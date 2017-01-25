module.exports = opts => {
  const autobahn = require('autobahn');
  const udm = require('../core');
  const port = process.env.PORT;
  const connection = new autobahn.Connection({
     url: 'ws://127.0.0.1:'+port+'/ws',
     realm: 'realm1'
  });

  const endpoints = {
    user: require('./user.js')
  };

  for(key in endpoints)
    for(key in endpoints[key])
      console.log(key);

  connection.onopen = session => {
    //endpoints.user(session);
  }

  return new Promise( (resolve, reject) => {
    udm.boot(opts)
      .then( () => resolve() )
      .catch( err => reject(err) );
  });
}
