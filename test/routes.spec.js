const chai = require('chai');
// eslint-disable-next-line no-unused-vars
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage', () => {
    return chai.request(server)
      .get('/')
      .then(response => {
        response.should.have.status(200);
        response.should.be.html;
      })
      .catch(err => {
        throw err;
      });
  });
  it('should return a 404 for a route that does not exist', () => {
    return chai.request(server)
      .get('/sad')
      .then(response => {
        response.should.have.status(404);
      })
      .catch(err => {
        throw err;
      });
  });
});

describe('API Routes', () => {
  before((done) => {
    database.migrate.latest()
      .then( () => done())
      .catch(error => {
        throw error;
      });
  });

  beforeEach((done) => {
    database.seed.run()
      .then(() => done())
      .catch(error => {
        throw error;
      });
  });
  describe('GET /api/v1/projects', () => {
    it('should return all projects', () => {
      return chai.request(server)
        .get('/api/v1/projects')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(30);
          response.body[0].should.have.property('name');
          response.body[0].name.should.be.a('string');
          response.body[0].should.have.property('location');
          response.body[0].location.should.be.a('string');
          response.body[0].should.have.property('union');
          response.body[0].union.should.be.a('boolean');
          response.body[0].should.have.property('public');
          response.body[0].public.should.be.a('boolean');

          response.body[0].should.be.a('object');
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('United Airlines Remodel');

        })
        .catch(err => {
          throw err;
        });
    });
    it.skip('should return a 404 for a route that does not exist', () => {
      return chai.request(server)
        .get('/api/v1/sad')
        .then(response => {
          response.should.have.status(404);
        })
        .catch(err => {
          throw err;
        });
    });
  });
});
