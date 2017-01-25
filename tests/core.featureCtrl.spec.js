const chai = require('chai');
const expect = chai.expect;
const udm = require('../src/core');

before( done => {
  udm.boot()
    .then( done )
    .catch( err => console.log(err));
});

describe('feature controls', () => {
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

  it('should create a new feature control', done => {
    udm.decisionspace.featurectrl.create({
      id: null,
      title: 'my first feature control',
      description: 'my first feature control',
      componentType: 'COMMENT_FORM',
      author: 1
    })
      .then( () => done())
      .catch( err => console.log(err));
  });
  it('should retrieve a list of all created feature controls', done => {
    udm.decisionspace.featurectrl.retrieveAll()
      .then( () => done())
      .catch( err => console.log(err));
  });
  it('should update the previously created feature control', done => {
     udm.decisionspace.featurectrl.withId(1).update({
       id: 1,
       title: 'my first feature control (updated)',
       description: 'has been updated',
       componentType: 'COMMENT_FORM',
       author: 1,
     })
      .then( () => done())
      .catch( err => console.log(err));
   
  });
  it('should remove the previously created feature control', done => {
    udm.decisionspace.featurectrl.withId(1).remove()
      .then( () => done())
      .catch( err => console.log(err));
  })
});


