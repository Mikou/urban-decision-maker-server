module.exports = (udm, data) => {
  return new Promise( (resolve, reject) => {
    
    const insertUsers = users => {
      return new Promise( (resolve, reject) => {
        if (!users || users.length < 1) {
          reject("the dataset must describe one or more users");
        } else {
          const promises = users.map( user => udm.user.create(user) );
          Promise.all(promises)
            .then(() => resolve())
            .catch( err => reject(err));
        }
      });
    };

    const insertBundles = bundles => {
      return new Promise( (resolve, reject) => {
        if (!bundles || bundles.length < 1) {
          resolve();
        } else {
          const promises = bundles.map( bundle => udm.bundle.create(bundle) );
          Promise.all(promises)
            .then(() => resolve())
            .catch( err => reject(err));
        }
      });
    };

    const insertDecisionspaces = decisionspaces => {
      return new Promise( (resolve, reject) => {
        if (!decisionspaces || decisionspaces.length < 1) {
          reject("the dataset must describe one or more decisionspaces");
        } else {
          const promises = decisionspaces.map( decisionspace => udm.decisionspace.create(decisionspace) );
          Promise.all(promises)
            .then(decisionspaces => {
              const promises = decisionspaces.map( decisionspace => insertBundles(decisionspace.bundle ))
              Promise.all(promises)
                .then( () => resolve())
                .catch( err => {console.log(err);reject(err)});
            })
            .catch( err => reject(err));
        }
      });
    }
    const insertVisctrls = visctrls => {
      return new Promise( (resolve, reject) => {
        if (!visctrls || visctrls.length < 1) {
          resolve();
        } else {
          const promises = visctrls.map( visctrl => udm.decisionspace.create(visctrl));
          Promise.all(promises)
            .then(() => resolve())
            .catch( err => reject(err));
        }
      });
    }
    const insertFeaturectrls = featurectrls => {
      return new Promise( (resolve, reject) => {
        if (!featurectrls || featurectrls < 1) {
          resolve();
        } else {
          const promises = featurectrls.map( featurectrl => udm.decisionspace.create(featurectrl));
          Promise.all(promises)
            .then(() => resolve())
            .catch( err => reject(err));
        }
      });
    };

    insertUsers(data.users)
      .then( () => insertDecisionspaces(data.decisionspaces) )
      .then( () => insertVisctrls(data.visctrls) )
      .then( () => insertFeaturectrls(data.featurectrls) )
      .then( () => resolve() )
      .catch( err => reject(err))

  });
}
