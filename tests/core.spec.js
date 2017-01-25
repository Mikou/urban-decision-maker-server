const chai = require('chai');
const expect = chai.expect;
const udm = require('../src/core');
const dummyData = require('../data/dummyData.json');

before( done => {
  udm.boot({
    dummyData: dummyData
  })
    .then( done )
    .catch( err => console.log(err));
});

describe('udm.decisionspace', () => {
  const Decisionspace = {
    id:null,
    title: "test decision space",
    description: "this is a simple text string with extra information",
    published: true,
    author:1
  };

  it('should create a decisionspace', done => {
    udm.decisionspace.create(Decisionspace)
      .then( () => done() )
  });
  it('should retrieve a decisionspace', done => {
    udm.decisionspace.withId(1).retrieve()
      .then( () => done() )
  });
  it('should remove a decisionspace', done => {
    udm.decisionspace.withId(1).remove()
      .then( id => done() )
  });
  it('should not be possible to retrieve a removed decisionspace', done => {
    udm.decisionspace.withId(1).retrieve()
      .catch( err => done() )
  });
  it('should not be possible to update a removed decisionspace', done => {
    udm.decisionspace.withId(1).update({
      id: 1,
      title: "malicious update attempt",
      description: null,
      published: false,
      author:1
    })
    .catch(err => done() );
  });
  it('should create a decisionspace', done => {
    udm.decisionspace.create(Decisionspace)
      .then( () => done() )
  });
  it('should update a decisionspace', done => {
    udm.decisionspace.withId(2).update({
      id: 2,
      title: "updated decisionspace",
      description: null,
      published: false,
      author:1
    })
      .then( () => done() )
      .catch(err => console.error(err) );
  });
  it('should grant access for a user in a decisionspace', done => {
    udm.decisionspace.withId(2).grant(1)
      .then( () => done() )
      .catch(err => console.error(err) );
  });
  it('should hold that user 1 can now access decisionspace 2', done => {
    udm.decisionspace.withId(2).canAccess(1)
      .then( () => done() )
      .catch(err => console.error(err));
  });
  it('should revoke access for a user in a decisionspace', done => {
    udm.decisionspace.withId(2).revoke(1)
      .then( () => done() )
      .catch(err => console.error(err) );
  });
  it('should create a new bundle', done => {
    udm.decisionspace.withId(2).bundle.create({
      title: 'my first visualization',
      description: 'my first visualization',
      published: true,
      author:1,
      visualization: {
        url: 'http://www.dummyvis.com/#93234',
      }
    })
    .then( () => udm.decisionspace.withId(2).bundle.create({
      title: 'my second visualization',
      description: null,
      published: false,
      author:1,
      visualization: {
        url: 'http://www.dummyvis.com/#28760',
      }

    }))
    .then( () => done())
    .catch(err => console.error(err) );
  });
  it('should add 2 features in a bundle', done => {
    udm.decisionspace.withId(2).bundle.withId(1).addFeature({
      componentType: 'COMMENT_FORM'
    })
    .then( () => udm.decisionspace.withId(2).bundle.withId(1).addFeature({
      componentType: 'COMMENT_ARCHIVE'
    }))
    .then( () => done())
    .catch( err => console.error(err) );
  });
  it('should retrieve a list of bundles within a given decisionspace', done => {
    udm.decisionspace.withId(2).bundle.retrieveAll()
      .then( bundles => {
        done();
      })
      .catch( err => console.log(err));
  });
  it('should retrieve a full decisionspace (bundle, visualizations and features included)', done => {
    udm.decisionspace.withId(2).retrievefull()
      .then( ds => {
        done(); 
      })
      .catch( err => console.log(err));
  });
  it('should update a bundle', done => {
    console.log("TODO");
    done(); 
  })
  it('should delete a bundle', done => {
    udm.decisionspace.withId(2).bundle.withId(1).remove()
    .then( res => done())
    .catch(err => console.error(err) );
  });
  it('should retrieve a full decisionspace (bundle, visualizations and features included)', done => {
    udm.decisionspace.withId(2).retrievefull()
      .then( ds => {
        done(); 
      })
      .catch( err => console.log(err));
  });

  after( done => {
    done();
  });
});
