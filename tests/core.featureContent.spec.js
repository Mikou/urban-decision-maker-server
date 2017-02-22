const chai = require('chai');
const expect = chai.expect;
const udm = require('../src/core');
const dummyData = require('../data/dummyData.json');

describe('udm.featureContent', () => {
  before( done => {
    udm.boot({
      dummyData: dummyData
    })
      .then( done )
      .catch( err => console.log(err));
  });

  it('should retrieve the comments posted in decisionspace with id 1 on bundle with id 1', done => {
    udm.decisionspace.withId(1)
       .bundle.withId(1)
       .feature.retrieveContent()
      .then( featureContent => {
        console.log(featureContent);
        done();
      })
      .catch( err => console.log(err) );
  });
});
