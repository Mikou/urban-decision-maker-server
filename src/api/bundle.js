module.exports = (prefixes, session, autobahn, _udm) => new Promise((resolve, reject) => {
  const decisionspaceRepo = _udm.decisionspace;
  const create = args => {
    const d = autobahn.when.defer();
    const decisionspaceId = args[0];
    const bundle = args[1];

    const repo = _udm.decisionspace
                     .withId(decisionspaceId)
                     .bundle;
    repo.create(bundle)
      .then( res => d.resolve(res) )
      .catch( err => {
        console.log(err);
        d.reject(err) 
      });

    return d.promise;
  };
  const addFeature = args => {
    const d = autobahn.when.defer();
    const decisionspaceId = args[0];
    const bundleId = args[1];
    const featureCtrl = args[2];
    const repo = _udm.decisionspace
                     .withId(decisionspaceId)
                     .bundle
                     .withId(bundleId);
    repo.feature.add(featureCtrl)
      .then( res => {
        d.resolve(res);
      })
      .catch( err => {
        console.log(err);
        d.reject(err) 
      });
    return d.promise;
  };

  const addFeatureContent = args => {
    const d = autobahn.when.defer();
    const decisionspaceId = args[0];
    const bundleId= args[1];
    const content=args[2];
    _udm.decisionspace.withId(decisionspaceId)
       .bundle.withId(bundleId)
       .feature.addContent(content)
      .then( content => {
        session.publish('frontend.feature.addedContent', [decisionspaceId, bundleId, content]);
        d.resolve(content);
      })
      .catch( err => {
        console.log(err);
        d.reject(content) 
      });
    return d.promise;
  }
  const prefix = prefixes.api + '.' + prefixes.domain;
  console.log("---------------------------------------------------");
  console.log("registering methods for " + prefix);
  console.log("---------------------------------------------------");
  const endpoints = [
    {name: 'create',            cb: create},
    {name: 'addFeature',        cb: addFeature},
    {name: 'addFeatureContent', cb: addFeatureContent}
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
