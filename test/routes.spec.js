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
  it.skip('should return the homepage', () => {
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
  it.skip('should return a 404 for a route that does not exist', () => {
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
    it.skip('should return all projects', () => {
      return chai.request(server)
        .get('/api/v1/projects')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('randomProjectName');
          response.body.randomProjectName.should.be.a('string');
          response.body.should.have.property('randomPaletteName');
          response.body.randomPaletteName.should.be.a('string');
          response.body.should.have.property('projects');
          response.body.projects.should.be.a('array');
          response.body.projects.length.should.equal(1);
          response.body.projects[0].should.be.a('object');
          response.body.projects[0].should.have.property('name');
          response.body.projects[0].name.should.equal('Fuzzy Bunnies');
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
