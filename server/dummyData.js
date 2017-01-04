const dbConnection = require('./dbConnection');
const logger = require('./logger');
const userService = require('./user');
const decisionspaceService = require('./decisionspace');
const visualizationService = require('./visualization');
const widgetService = require('./widget');
const visCtrlService = require('./visCtrl');

const dummyVisCtrls = [
  {
    name:'control 1',
    url: 'http://dummyvis.com/#1'
  },
  {
    name:'control 2',
    url: 'http://dummyvis.com/#2'
  },
  {
    name:'control 3',
    url: 'http://dummyvis.com/#3'
  }
];

const dummyUser_paul = {
  id: null,
  username: "paul",
  password: "n0t_s0_s3cr3t",
  email: process.env.PRIVATE_EMAIL,
  firstname: "Paul",
  lastname: "Snatch",
  roles: ['planner'],
  deleted: false
};

const dummyUser = {
  id: null,
  username: "dumber",
  password: "n0t_s0_s3cr3t",
  email: process.env.PRIVATE_EMAIL,
  firstname: "Jim",
  lastname: "Carrey",
  roles: ['admin', 'planner'],
  deleted: false
};
const dummyDecisionspace1 = {
  name:"dummy decision space 1 (private)",
  description:"This is my first dummy decision space",
  published: false,
  userid:null
};
const dummyDecisionspace2 = {
  name:"dummy decision space 2 (public)",
  description:"This is my second dummy decision space",
  published: true,
  userid:null
};
const dummyVisualizationWidget = {
  title: "my dummy visualization widget",
  type: 'visualization',
  gravity: 0,
  visualization: {
    url: 'http://dummyvis.com/#1',
    name: 'this field should be removed?'
  }
};
const dummyVisualizationWidget2 = {
  title: "my dummy visualization widget 2",
  type: 'visualization',
  gravity: 0,
  visualization: {
    url: 'http://dummyvis.com/#2',
    name: 'this field should be removed?'
  }
};
const dummyVisualizationWidget3 = {
  title: "my dummy visualization widget 3",
  type: 'visualization',
  gravity: 1,
  visualization: {
    url: 'http://dummyvis.com/#3',
    name: 'this field should be removed?'
  }
};

const create = function () {
  const createDummyUser1 = userService.create(dummyUser);
  const createDummyUser2 = userService.create(dummyUser_paul);
  return new Promise( (resolve, reject) => {
    Promise.all([createDummyUser1, createDummyUser2]).then((users) => {
      dummyDecisionspace1.userid = users[0].id;
      dummyDecisionspace2.userid = users[0].id;
      const promises = [];
      promises.push(decisionspaceService.create(dummyDecisionspace1));
      promises.push(decisionspaceService.create(dummyDecisionspace2));
      for(let i=0; i<dummyVisCtrls.length; i++) {
        promises.push(visCtrlService.create(dummyVisCtrls[i], users[0].id));
      }
      return new Promise( (resolve, reject) => {
        Promise.all(promises).then( (decisionspaces) => {
          resolve(decisionspaces);
        }).catch( (err) => {
          reject(err);
        });
      });
   
    }).then( (decisionspaces) => {
      const promises = [];
      promises.push(widgetService.create(decisionspaces[0].id, dummyVisualizationWidget));
      promises.push(widgetService.create(decisionspaces[1].id, dummyVisualizationWidget2));
      promises.push(widgetService.create(decisionspaces[1].id, dummyVisualizationWidget3));
      promises.push(decisionspaceService.authorize(dummyUser.id, dummyDecisionspace1.id));
      return new Promise( (resolve, reject) => {
        Promise.all(promises).then( (widgets) => {
          resolve(widgets);
        }).catch( (err) => {
          console.log(err);
          reject(err);
        });
      });
    }).then( (widgets) => {
      resolve();
    }).catch( (err) => {
      console.log(err);
      reject(err);
    });
  });
}

module.exports = {
  create: create
}
