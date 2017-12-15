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
          response.body[0].should.be.a('object');
          response.body[0].should.have.property('name');
          response.body[0].name.should.be.a('string');
          response.body[0].should.have.property('location');
          response.body[0].location.should.be.a('string');
          response.body[0].should.have.property('union');
          response.body[0].union.should.be.a('boolean');
          response.body[0].should.have.property('public');
          response.body[0].public.should.be.a('boolean');
        })
        .catch(err => {
          throw err;
        });
    });
    it('should return a 404 for a route that does not exist', () => {
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

  describe('POST /api/v1/projects', () => {
    it('should add a new project in the database', () => {
      return chai.request(server)
        .post('/api/v1/projects')
        .send({
          name: 'Vikings',
          location: 'Minneapolis',
          union: true,
          public: false,
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJvYmJpZUB0dXJpbmcuaW8iLCJhcHBOYW1lIjoiYnlvYiIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTMyODMzMjYsImV4cCI6MTU0NDgxOTMyNn0.WJKSkDWP_2Xo888JaDLNkW7p2vs4Q7E-QWecJT2E60k'
        })
        .then(response => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.id.should.be.a('number');
        })
        .catch(err => {
          throw err;
        });
    });
    it('should return a 404 for a route that does not exist', () => {
      return chai.request(server)
        .post('/api/v1/projects/sad')
        .then(response => {
          response.should.have.status(404);
        })
        .catch(err => {
          throw err;
        });
    });
  });

  describe('GET /api/v1/employees', () => {
    it('should return all employees', () => {
      return chai.request(server)
        .get('/api/v1/employees')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body[0].should.be.a('object');
          response.body[0].should.have.property('id');
          response.body[0].id.should.be.a('number');
          response.body[0].should.have.property('name');
          response.body[0].name.should.be.a('string');
          response.body[0].should.have.property('position');
          response.body[0].position.should.be.a('string');
          response.body[0].should.have.property('email');
          response.body[0].email.should.be.a('string');
          response.body[0].should.have.property('phone');
          response.body[0].phone.should.be.a('string');
        })
        .catch(err => {
          throw err;
        });
    });
  });

  describe('POST /api/v1/employees', () => {
    it('should add a new employee in the database', () => {
      return chai.request(server)
        .post('/api/v1/employees')
        .send({
          name: 'Eric Trump',
          position: 'Loser',
          email: 'loser@marlago.com',
          phone: '222-222-2222',
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJvYmJpZUB0dXJpbmcuaW8iLCJhcHBOYW1lIjoiYnlvYiIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTMyODMzMjYsImV4cCI6MTU0NDgxOTMyNn0.WJKSkDWP_2Xo888JaDLNkW7p2vs4Q7E-QWecJT2E60k'
        })
        .then(response => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.id.should.be.a('number');
        })
        .catch(err => {
          throw err;
        });
    });
    it('should return a 404 for a route that does not exist', () => {
      return chai.request(server)
        .post('/api/v1/employees/sad')
        .then(response => {
          response.should.have.status(404);
        })
        .catch(err => {
          throw err;
        });
    });
  });

  describe('DELETE /api/v1/projects/:projectId', () => {
    it('should destroy project from database', () => {
      chai.request(server)
        .delete('/api/v1/projects/4')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJvYmJpZUB0dXJpbmcuaW8iLCJhcHBOYW1lIjoiYnlvYiIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTMyODMzMjYsImV4cCI6MTU0NDgxOTMyNn0.WJKSkDWP_2Xo888JaDLNkW7p2vs4Q7E-QWecJT2E60k')
        .then(response => {
          response.should.have.status(204);
        })
        .catch(error => {
          throw error;
        });
    });

    it('should return status 422 if project does not exist', () => {
      chai.request(server)
        .delete('/api/v1/projects/300')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJvYmJpZUB0dXJpbmcuaW8iLCJhcHBOYW1lIjoiYnlvYiIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTMyODMzMjYsImV4cCI6MTU0NDgxOTMyNn0.WJKSkDWP_2Xo888JaDLNkW7p2vs4Q7E-QWecJT2E60k')
        .then(response => {
          response.should.have.status(422);
        })
        .catch(error => {
          throw error;
        });
    });
  });

  describe('GET /api/v1/projects/:projectId', () => {
    it('should return a single project', () => {
      return chai.request(server)
        .get('/api/v1/projects/5')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.be.a('object');
          response.body.should.have.property('name');
          response.body.name.should.be.a('string');
          response.body.should.have.property('location');
          response.body.location.should.be.a('string');
          response.body.should.have.property('union');
          response.body.union.should.be.a('boolean');
          response.body.should.have.property('public');
          response.body.public.should.be.a('boolean');
        })
        .catch(err => {
          throw err;
        });
    });
  });

  describe('GET /api/v1/employees', () => {
    it('should return a single employee', () => {
      return chai.request(server)
        .get('/api/v1/employees/5')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.id.should.be.a('number');
          response.body.should.have.property('name');
          response.body.name.should.be.a('string');
          response.body.should.have.property('position');
          response.body.position.should.be.a('string');
          response.body.should.have.property('email');
          response.body.email.should.be.a('string');
          response.body.should.have.property('phone');
          response.body.phone.should.be.a('string');
        })
        .catch(err => {
          throw err;
        });
    });
  });

  describe('PATCH /api/v1/employees/:employeeId', () => {
    it('should update employee from database', () => {
      chai.request(server)
        .patch('/api/v1/employees/4')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJvYmJpZUB0dXJpbmcuaW8iLCJhcHBOYW1lIjoiYnlvYiIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTMyODMzMjYsImV4cCI6MTU0NDgxOTMyNn0.WJKSkDWP_2Xo888JaDLNkW7p2vs4Q7E-QWecJT2E60k')
        .send({
          name: 'Dr. Who'
        })
        .then(response => {
          response.should.have.status(204);
        })
        .catch(error => {
          throw error;
        });
    });

    it('should return status 422 if employee does not exist', () => {
      chai.request(server)
        .patch('/api/v1/employees/112')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJvYmJpZUB0dXJpbmcuaW8iLCJhcHBOYW1lIjoiYnlvYiIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTMyODMzMjYsImV4cCI6MTU0NDgxOTMyNn0.WJKSkDWP_2Xo888JaDLNkW7p2vs4Q7E-QWecJT2E60k')
        .send({
          name: 'Dr. Who'
        })
        .then(response => {
          response.should.have.status(422);
        })
        .catch(error => {
          throw error;
        });
    });
  });

  describe('PATCH /api/v1/projects/:projectId', () => {
    it('should update project from database', () => {
      chai.request(server)
        .patch('/api/v1/projects/4')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJvYmJpZUB0dXJpbmcuaW8iLCJhcHBOYW1lIjoiYnlvYiIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTMyODMzMjYsImV4cCI6MTU0NDgxOTMyNn0.WJKSkDWP_2Xo888JaDLNkW7p2vs4Q7E-QWecJT2E60k')
        .send({
          name: 'Tardis'
        })
        .then(response => {
          response.should.have.status(204);
        })
        .catch(error => {
          throw error;
        });
    });

    it('should return status 422 if project does not exist', () => {
      chai.request(server)
        .patch('/api/v1/projects/112')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJvYmJpZUB0dXJpbmcuaW8iLCJhcHBOYW1lIjoiYnlvYiIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTMyODMzMjYsImV4cCI6MTU0NDgxOTMyNn0.WJKSkDWP_2Xo888JaDLNkW7p2vs4Q7E-QWecJT2E60k')
        .send({
          name: 'Tardis'
        })
        .then(response => {
          response.should.have.status(422);
        })
        .catch(error => {
          throw error;
        });
    });
  });

  describe('POST /api/v1/projects/:projectId/employees/:employeeId', () => {
    it('should insert an employee to a project', () => {
      chai.request(server)
        .post('/api/v1/projects/4/employees/4')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJvYmJpZUB0dXJpbmcuaW8iLCJhcHBOYW1lIjoiYnlvYiIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTMyODMzMjYsImV4cCI6MTU0NDgxOTMyNn0.WJKSkDWP_2Xo888JaDLNkW7p2vs4Q7E-QWecJT2E60k')
        .then(response => {
          response.should.have.status(204);
        })
        .catch(error => {
          throw error;
        });
    });

    it('should return status 422 if project or employee does not exist', () => {
      chai.request(server)
        .post('/api/v1/projects/4/employees/114')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJvYmJpZUB0dXJpbmcuaW8iLCJhcHBOYW1lIjoiYnlvYiIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTMyODMzMjYsImV4cCI6MTU0NDgxOTMyNn0.WJKSkDWP_2Xo888JaDLNkW7p2vs4Q7E-QWecJT2E60k')
        .then(response => {
          response.should.have.status(422);
        })
        .catch(error => {
          throw error;
        });
    });
  });

  describe('DELETE /api/v1/projects/:projectId/employees/:employeeId', () => {
    it('should destroy an employee to a project', () => {
      chai.request(server)
        .delete('/api/v1/projects/1/employees/1')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJvYmJpZUB0dXJpbmcuaW8iLCJhcHBOYW1lIjoiYnlvYiIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTMyODMzMjYsImV4cCI6MTU0NDgxOTMyNn0.WJKSkDWP_2Xo888JaDLNkW7p2vs4Q7E-QWecJT2E60k')
        .then(response => {
          response.should.have.status(204);
        })
        .catch(error => {
          throw error;
        });
    });

    it('should return status 422 if project or employee does not exist', () => {
      chai.request(server)
        .delete('/api/v1/projects/1/employees/114')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJvYmJpZUB0dXJpbmcuaW8iLCJhcHBOYW1lIjoiYnlvYiIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTMyODMzMjYsImV4cCI6MTU0NDgxOTMyNn0.WJKSkDWP_2Xo888JaDLNkW7p2vs4Q7E-QWecJT2E60k')
        .then(response => {
          response.should.have.status(422);
        })
        .catch(error => {
          throw error;
        });
    });
  });

  describe('DELETE /api/v1/employees/:employeeId', () => {
    it('should destroy employee from database', () => {
      chai.request(server)
        .delete('/api/v1/employees/4')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJvYmJpZUB0dXJpbmcuaW8iLCJhcHBOYW1lIjoiYnlvYiIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTMyODMzMjYsImV4cCI6MTU0NDgxOTMyNn0.WJKSkDWP_2Xo888JaDLNkW7p2vs4Q7E-QWecJT2E60k')
        .then(response => {
          response.should.have.status(204);
        })
        .catch(error => {
          throw error;
        });
    });

    it('should return status 422 if project does not exist', () => {
      chai.request(server)
        .delete('/api/v1/employees/12')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJvYmJpZUB0dXJpbmcuaW8iLCJhcHBOYW1lIjoiYnlvYiIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTMyODMzMjYsImV4cCI6MTU0NDgxOTMyNn0.WJKSkDWP_2Xo888JaDLNkW7p2vs4Q7E-QWecJT2E60k')
        .then(response => {
          response.should.have.status(422);
        })
        .catch(error => {
          throw error;
        });
    });
  });

  describe('GET /api/v1/projects/:projectId/employees', () => {
    it('should return all employees for a specific project', () => {
      return chai.request(server)
        .get('/api/v1/projects/1/employees')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body[0].should.be.a('object');
          response.body[0].should.have.property('id');
          response.body[0].id.should.be.a('number');
          response.body[0].should.have.property('name');
          response.body[0].name.should.be.a('string');
          response.body[0].should.have.property('position');
          response.body[0].position.should.be.a('string');
          response.body[0].should.have.property('email');
          response.body[0].email.should.be.a('string');
          response.body[0].should.have.property('phone');
          response.body[0].phone.should.be.a('string');
        })
        .catch(err => {
          throw err;
        });
    });
  });

  describe('GET /api/v1/employees/:employeeId/projects', () => {
    it('should return all project for a specific employee', () => {
      return chai.request(server)
        .get('/api/v1/employees/4/projects')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body[0].should.be.a('object');
          response.body[0].should.have.property('name');
          response.body[0].name.should.be.a('string');
          response.body[0].should.have.property('location');
          response.body[0].location.should.be.a('string');
          response.body[0].should.have.property('union');
          response.body[0].union.should.be.a('boolean');
          response.body[0].should.have.property('public');
          response.body[0].public.should.be.a('boolean');
        })
        .catch(err => {
          throw err;
        });
    });
  });

});
