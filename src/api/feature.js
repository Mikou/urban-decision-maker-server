module.exports = (prefixes, session, autobahn, _udm) => new Promise( (resolve, reject) => {
  const retrievecontent = args => {
    const d = autobahn.when.defer();
    const decisionspaceId = args[0];
    const bundleId = args[1];
    const contentType = args[2];
    //console.log(decisionspaceId, bundleId, contentType);
    /*try {
    const repo = udm.decisionspace.withId(decisionspaceId)
                    .bundle.withId(bundleId).feature

    /*repo.retieveContent(contentType)
    } catch(err) {
      console.log(err);
    }
    .then( res => d.resolve(res))
    .catch( err => {
      console.log(err);
      d.reject(err)
    });1*/
    return d.promise;
  }
  const prefix = prefixes.api + '.' + prefixes.domain;
  console.log("---------------------------------------------------");
  console.log("registering methods for " + prefix);
  console.log("---------------------------------------------------");
  const endpoints = [
    {name: 'retrievecontent', cb: retrievecontent}
  ];
  const promises = endpoints.map(endpoint => {
    const fqn = prefix + '.' + endpoint.name;
    console.log(fqn);
    session.register(fqn, endpoint.cb)
  })
  Promise.all(promises)
    .then(() => resolve() )
    .catch( err => reject(err));

});


