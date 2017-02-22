module.exports = (udm, data) => {
  return new Promise( (resolve, reject) => {
    
    const insertUdm = udm => new Promise( (resolve, reject) => {
      resolve();
    })

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
    const insertFeatureContents = (decisionspaceId, bundleId, contents) => {
      return new Promise( (resolve, reject) => {
        if(!contents || contents.length < 1) {
          resolve();
        } else {
          const promises = contents.map( content =>
            udm.decisionspace.withId(decisionspaceId)
              .bundle.withId(bundleId)
              .feature.addContent(content)
          );

          Promise.all(promises)
            .then( () => resolve() )
            .catch( err => reject(err) );
        }
      });
    }
    const insertFeatures = (decisionspaceId, bundleId, features) => {
      return new Promise( (resolve, reject) => {
        if (!features || features.length < 1) {
          resolve();
        } else {
          const promises = features.map(
            feature => {
              return udm.decisionspace.withId(decisionspaceId)
                 .bundle.withId(bundleId)
                 .feature.add(feature)
            }
          );
          Promise.all(promises)
            .then( features => {

              const promises = features.map(feature => {
                return insertFeatureContents(decisionspaceId, bundleId, feature.contents);
              });

              Promise.all(promises)
                .then( () => resolve() )
                .catch( err => reject(err) );

            })
            .catch( err => reject(err) );
        }
      });
    }
    const insertBundles = (decisionspaceId, bundles) => {
      return new Promise( (resolve, reject) => {
        if (!bundles || bundles.length < 1) {
          resolve();
        } else {
          const promises = bundles.map( 
              bundle => udm.decisionspace.withId(decisionspaceId).bundle.create(bundle) );
          Promise.all(promises)
            .then(bundleIds => {
              const promises = bundles.map(
                bundle => {
                  return insertFeatures(decisionspaceId, bundle.id, bundle.features) 
                });

              Promise.all(promises)
                .then( () => resolve() )
                .catch( err => reject(err) );
            })
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
              const promises = decisionspaces.map( 
                  decisionspace => insertBundles(decisionspace.id, decisionspace.bundles ) );
              Promise.all(promises)
                .then( () => resolve())
                .catch( err => reject(err));
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
          const promises = visctrls.map( visctrl => udm.decisionspace.visctrl.create(visctrl));
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
          const promises = featurectrls.map( featurectrl => udm.decisionspace.featurectrl.create(featurectrl));
          Promise.all(promises)
            .then(() => resolve())
            .catch( err => reject(err));
        }
      });
    };
    const insertComponentTypes = componentTypes => {
      return new Promise( (resolve, reject) => {
        if(!componentTypes || componentTypes < 1) {
          resolve();
        } else {
          const promises = componentTypes.map( componentType => 
              udm.feature.addComponentType(componentType));
          Promise.all(promises)
            .then(() => resolve())
            .catch( err => reject(err) );
        }
      });
    }

    const insertFeatureContentTypes = featureContentTypes => {
      return new Promise( (resolve, reject) => {
        if(!featureContentTypes || featureContentTypes < 1) {
          resolve();
        } else {
          const promises = featureContentTypes.map( featureContentType => 
              udm.feature.addFeatureContentType(featureContentType));
          Promise.all(promises)
            .then(() => resolve())
            .catch( err => reject(err) );
        }
      });
    }

      insertUdm(data.udm)
        .then( () => insertFeatureContentTypes(data.udm.featureContentTypes) )
        .then( () => insertComponentTypes(data.udm.componentTypes) )
        .then( () => insertUsers(data.udm.users) )
        .then( () => insertDecisionspaces(data.udm.decisionspaces) )
        .then( () => insertVisctrls(data.udm.visctrls) )
        .then( () => insertFeaturectrls(data.udm.featurectrls) )
        .then( () => resolve() )
      .catch( err => reject(err))

  });
}
