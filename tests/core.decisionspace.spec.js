const chai = require('chai');
const expect = chai.expect;
const udm = require('../src/core');
const dummyData = require('../data/dummyData.json');

describe('udm.decisionspace', () => {
  before( done => {
    udm.boot({
      dummyData: dummyData
    })
      .then( done )
      .catch( err => console.log(err));
  });

  const dummyDecisionspace = {
    id:null,
    title: "test decision space",
    description: "this is a simple text string with extra information",
    published: true,
    author:1
  };

  it('should create a decisionspace', done => {
    udm.decisionspace.create(dummyDecisionspace)
      .then( decisionspace => {
        expect(decisionspace).to.be.an('object');
        done();
      })
      .catch( err => console.log(err) );
  });
  it('should retrieve a decisionspace (without it\'s nested content)', done => {
    udm.decisionspace.withId(1).retrieve()
      .then( decisionspace => {
        expect(decisionspace).to.be.an('object');
        expect(decisionspace).to.not.have.property('bundles');
        done();
      })
  });
  it('should retrieve a decisionspace (along with it\'s nested content)', done => {
    udm.decisionspace.withId(1).retrievefull()
      .then( decisionspace => {
        expect(decisionspace).to.be.an('object');
        expect(decisionspace).to.have.property('bundles');
        done();
      })
  });
  it('should retrieve all decisionspaces', done => {
    udm.decisionspace.retrieve()
      .then( decisionspaces => {
        expect(decisionspaces).to.be.an('array');
        done();
      })
      .catch(err => console.log(err));
  });
  it('should remove a decisionspace', done => {
    udm.decisionspace.withId(1).remove()
      .then( id => {
        expect(id).to.be.a('number');
        done();
      })
      .catch(err => console.log(err));
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
    udm.decisionspace.create(dummyDecisionspace)
      .then( decisionspace => {
        expect(decisionspace).to.be.an('object');
        done() 
      })
      .catch(err => console.log(err));
  });
  it('should update a decisionspace', done => {
    udm.decisionspace.withId(2).update({
      id: 2,
      title: "updated decisionspace",
      description: null,
      published: false,
      author:1
    })
      .then( decisionspace => {
        expect(decisionspace).to.be.an('object');
        done() 
      })
      .catch(err => console.error(err) );
  });
  it('should grant access for a user in a decisionspace', done => {
    udm.decisionspace.withId(2).grant(1)
      .then( id => {
        expect(id).to.be.a('number');
        done() 
      })
      .catch(err => console.error(err) );
  });
  it('should hold that user 1 can now access decisionspace 2', done => {
    udm.decisionspace.withId(2).canAccess(1)
      .then( canAccess => {
        expect(canAccess).to.be.a('boolean');
        expect(canAccess).to.be.true;

        done() 
      })
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
