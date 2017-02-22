const chai = require('chai');
const expect = chai.expect;
const udm = require('../src/core');
const dummyData = require('../data/dummyData.json');

describe('udm.bundle', () => {
  before( done => {
    udm.boot({
      dummyData: dummyData
    })
    .then( done )
    .catch( err => console.log(err));
  });
  it('should add 2 features in a bundle', done => {
    udm.decisionspace.withId(2).bundle.withId(1).feature.add({
      componentType: 'COMMENT_FORM'
    })
    .then( featureId => {
      expect(featureId).to.be.a("number");
      return udm.decisionspace.withId(2).bundle.withId(1).feature.add({
        componentType: 'COMMENT_ARCHIVE'
      })
    })
    .then( featureId => {
      expect(featureId).to.be.a('number');
      done();
    })
    .catch( err => console.error(err) );
  });
  it('should retrieve a list of bundles within a given decisionspace', done => {
    udm.decisionspace.withId(2).bundle.retrieveAll()
      .then( bundles => {
        done();
      })
      .catch( err => console.log(err));
  });
});
