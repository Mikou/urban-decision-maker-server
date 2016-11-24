const autobahn = require('autobahn');
const dbConnection = require('./dbConnection');
const pgp = dbConnection.pgp;
const db = dbConnection.db;
const visualizationService = require('./visualization');

function create(decisionspaceId, widget) {
  const query = `
    INSERT INTO udm_widget (title, type, gravity, decisionspace_id) 
      VALUES (\$1, \$2, \$3, \$4)
    RETURNING id`
    ;

  return new Promise( (resolve, reject) => {
    
    db.one({
      text: query,
      values: [widget.title, widget.type, widget.gravity, decisionspaceId] 
    }).then( (result) => {
      widget.id = result.id;
      visualizationService.create(widget.id, widget.visualization).then( (visualization) => {
        widget.visualization = visualization;
        resolve(widget);
      }).catch( (err) => {
        reject(err); 
      });
    }).catch( (err) => {
      reject(err); 
    })

  });
}

function getWidgets(decisionspaceId) {
  const d = new autobahn.when.defer();
  const promises = [];
  db.any({
    text: 'SELECT * FROM udm_widget WHERE decisionspace_id=$1',
    values: [decisionspaceId[0]]
  }).then( (widgets) => {
    for(let i=0; i<widgets.length; i++) {
      const widget = widgets[i];
      if(widget.type == 'visualization') {
        promises.push(visualizationService.getVisualizationByWidgetId(widget.id).then( (visualization) => {
          widget.visualization = visualization;
        }).catch((err) => {
          widget.visualization = null;
        }));
      }
      widget.cptType = widget.type;
      widget.type = 'widget';
    }

    autobahn.when.all(promises).then( () => {
      d.resolve(widgets);
    });
  }).catch( (err) => {
    d.reject(err);
  });

  return d.promise;
}

const insertDummyData = function () {
  
}

const publish = function (session) {
  session.register('udm.backend.getWidgets', getWidgets).then(
     function (reg) {
        console.log("procedure getWidgets() registered");
     },
     function (err) {
        console.log("failed to register procedure: " + err);
     }

  );
}

module.exports = {
  create: create,
  exposeTo: publish
}
