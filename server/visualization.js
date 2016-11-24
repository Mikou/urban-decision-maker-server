const dbConnection = require('./dbConnection');
const db_prefix = 'udm';
const pgp = dbConnection.pgp;
const db = dbConnection.db;

const create = function (widgetId, visualization) {
  return new Promise( (resolve, reject) => {
    
    const query = `
      INSERT INTO udm_visualization(name, url, widget_id)
      VALUES (\$1, \$2, \$3)
      RETURNING id
    `;

    db.one({
      text:query,
      values: [visualization.name, visualization.url, widgetId]
    }).then( (result) => {
      visualization.id = result.id;
      resolve(visualization);
    }).catch( (err) => {
      reject(err);
    });

    /*const query = `
      WITH
      res_widget AS (
        INSERT INTO udm_widget (title, type) 
          VALUES (\$1, \$2)
        RETURNING id
      )

      INSERT INTO udm_visualization(name, url, widget_id)
      VALUES (\$3, \$4, (SELECT id FROM res_widget))
      RETURNING (SELECT id FROM res_widget)
    `;*/

    /*db.one({
      text: query,
      values: [widget.title, widget.type, widget.visualization.name, widget.visualization.url] 
    }).then( (result) => {
      widget.id = result.id;
      resolve(widget);
    }).catch( (err) => {
      reject(err); 
    })*/
  });
}

const getVisualizationByWidgetId = function(id) {
  return new Promise( (resolve, reject) => {
    const query = 'SELECT url FROM udm_visualization WHERE widget_id=$1';
    db.one({
      text: query,
      values: [id]
    }).then( (result) => {
     resolve(result); 
    }).catch( (err) => {
      reject(err); 
    })
  });
}

module.exports = {
  create:create,
  getVisualizationByWidgetId: getVisualizationByWidgetId
}
