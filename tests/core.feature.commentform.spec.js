const chai = require('chai');
const expect = chai.expect;
const udm = require('../src/core');
const dummyData = require('../data/dummyData.json');

describe('udm.feature.commentform', () => {
  before( done => {
    udm.boot({
      dummyData: dummyData
    })
    .then( done )
    .catch( err => console.log(err));
  });

  it('should create a new comment', done => {
    const comment = {
      author: 1,
      topic:   'my first comment',
      message: 'This is a simple test message'
    };

    const featureContent = {
      author: 1,
      content: comment
    }

    udm.decisionspace.withId(1)
       .bundle.withId(1)
       .feature.addContent(comment)
      .then( feature => {
        expect(feature).to.be.a('object');
        expect(feature.topic).to.equal(comment.topic);
        done();
      })
      .catch( err => console.log(err) );
  });
});
