const sql = require('../sql').feature;
module.exports = (rep, pgp) => {
  return {
    /*add: (decisionspaceId, bundleId, featureContentType, content) => new Promise( (resolve, reject) => {
      switch(featureContentType) {
        case "commentform" :
          rep.one(sql.addFeatureContent, [decisionspaceId, bundleId, featureContentType, content.author, content])
          .then( res => {
            content.id = res.id,
            resolve(content);
          })
          .catch(err => {
            console.log(err);
            reject(err) ;
          })
          break;
      }

    }),*/
    add: (decisionspaceId, bundleId, feature) => new Promise( (resolve, reject) => {
      rep.one(sql.addFeature, [bundleId, feature.componentType])
        .then( res => {
          feature.id = res.id;
          resolve(feature);
        })
        .catch( err => {
          reject(err) 
        });
    }),
    addContent: (decisionspaceId, bundleId, content) => new Promise( (resolve, reject) => {
      rep.one(sql.addFeatureContent, [decisionspaceId, bundleId, "COMMENT", content.author, content])
        .then( res => {
          content.id = res.id;
          resolve(content);
        })
        .catch( err => {
          reject(err) 
        });
    }),
    addFeatureContentType: (contentType) => new Promise( (resolve, reject) => {
      rep.one(sql.addFeatureContentType, contentType.type)
        .then( res => {
          contentType.id = res.id;
          resolve(contentType);
        })
        .catch( err => {
          reject(err);
        });
    }),
    retrieveContent: (decisionspaceId, bundleId) => new Promise((resolve, reject) => {
      rep.any(sql.retrieveContent, [decisionspaceId, bundleId])
        .then( res => {
          resolve(res);
        })
        .catch( err => {
          reject(err);
        });
    }),
    addComponentType: (componentType, input, output) => new Promise( (resolve, reject) => {
      rep.one(sql.addComponentType, [componentType.type, componentType.input, componentType.output])
        .then( res => {
          componentType.id = res.id;
          resolve(componentType);
        })
        .catch( err => {
          reject(err);
        })
    })
  }
}
