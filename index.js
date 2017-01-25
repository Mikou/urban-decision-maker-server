const dummyData = require('./data/dummyData.json');
const startUdm = require('./src/api');
startUdm({dummyData: dummyData})
  .then( () => {
    console.log("application started");
  })
  .catch( err => {
    console.error("the application failed to start");
    console.error(err);
  })
