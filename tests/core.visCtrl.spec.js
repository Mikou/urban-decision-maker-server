const chai = require('chai');
const expect = chai.expect;
const udm = require('../src/core');

before( done => {
  udm.boot()
    .then( done )
    .catch( err => console.log(err));
});

describe('visualization controls', () => {
  const User = {
    username: 'testuser',
    firstname: 'bob',
    lastname: 'johnson',
    email: 'bob@udm.dk',
    password: 's3cr3t',
    roles: ['domainexpert']
  };
 
  before( done => {
    udm.user.create(User)
      .then( () => {done();} )
  });

  it('should create a new visualization control', done => {
    udm.decisionspace.visctrl.create({
      id: null,
      title: 'my first visualization control',
      description: 'my first visualization control',
      author: 1,
      url: 'http://dummyvis.com/#1'
    })
      .then( () => done())
      .catch( err => console.log(err));
  });
  it('should retrieve a list of all created visualization controls', done => {
    udm.decisionspace.visctrl.retrieveAll()
      .then( () => done())
      .catch( err => console.log(err));
  });
  it('should update the previously created visualization control', done => {
     udm.decisionspace.visctrl.withId(1).update({
       id: 1,
       title: 'my first visualization control (updated)',
       description: 'has been updated',
       author: 1,
       url: 'http://dummyvis.com/#869876'
     })
      .then( () => done())
      .catch( err => console.log(err));
   
  });
  it('should remove the previously created visualization control', done => {
    udm.decisionspace.visctrl.withId(1).remove()
      .then( () => done())
      .catch( err => console.log(err));
  })
});


