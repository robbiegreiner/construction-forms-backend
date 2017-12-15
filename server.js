require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const app = express();
const bodyParser = require('body-parser');

const requireHTTPS = (request, response, next) => {
  if (request.header('x-forwarded-proto') !== 'https') {
    return response.redirect(`https://${request.header('host')}${request.url}`);
  }
  next();
};
if (process.env.NODE_ENV === 'production') { app.use(requireHTTPS); }

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('port', process.env.PORT || 3000);

app.locals.title = 'BYOB';

const checkAuth = (request, response, next) => {
  const token = request.body.token ||
                request.headers.authorization.replace('Bearer ', '') ||
                request.query.token;
  if (!token) {
    return response.status(403).send('You must be authorized to hit this endpoint.');
  }

  jwt.verify(token, process.env.SECRETKEY, (error, decoded) => {
    if (error) {
      return response.status(403).send('Invalid token');
    }
    if (!decoded.admin) {
      return response.status(403).send('Invalid Admin');
    }
    delete request.body.token;
    next();
  });
};

//request JWT
app.post('/api/v1/auth', (request, response) => {
  const { email, appName } = request.body;
  if (!email || !appName) {
    return response.status(422).send('Email and App Name are required');
  }
  const admin = email.includes('@turing.io') ? true : false;
  const token = jwt.sign({ email, appName, admin }, process.env.SECRETKEY, { expiresIn: '365d' });
  return response.status(200).json(token);
});

//get all projects
app.get('/api/v1/projects', (request, response) => {
  const allowedQueryParams = ['name', 'location', 'union', 'public'];
  const query = Object.keys(request.query).reduce((accum, key) => {
    if (allowedQueryParams.includes(key)) {
      return Object.assign(accum, { [key]: request.query[key] });
    }
    return accum;
  }, {});
  database('projects').where(query).select()
    .then(projects => {
      response.status(200).json(projects);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

//add new project
app.post('/api/v1/projects', checkAuth, (request, response) => {
  const project = request.body;
  for (let requiredParameter of ['name', 'location', 'union', 'public']) {
    if (!project[requiredParameter] && project[requiredParameter] !== false) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String>, location: <String>, union: <Boolean>, public: <Boolean> }. You're missing a "${requiredParameter}" property.` });
    }
  }
  database('projects').insert(project, 'id')
    .then(project => {
      response.status(201).json({ id: project[0] });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

//get all employee
app.get('/api/v1/employees', (request, response) => {
  const allowedQueryParams = ['name', 'position', 'email', 'phone'];
  const query = Object.keys(request.query).reduce((accum, key) => {
    if (allowedQueryParams.includes(key)) {
      return Object.assign(accum, { [key]: request.query[key] });
    }
    return accum;
  }, {});
  database('employees').where(query).select()
    .then(employees => {
      response.status(200).json(employees);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

//add new employee
app.post('/api/v1/employees', checkAuth, (request, response) => {
  const employee = request.body;
  for (let requiredParameter of ['name', 'position', 'email', 'phone']) {
    if (!employee[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String>, position: <String>, email: <String>, phone: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('employees').insert(employee, 'id')
    .then(employee => {
      response.status(201).json({ id: employee[0] });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

//get single project
app.get('/api/v1/projects/:projectId', (request, response) => {
  const id = request.params.projectId;
  database('projects').where('id', id).first()
    .then( project => {
      response.status(200).json(project);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

//get single employee
app.get('/api/v1/employees/:employeeId', (request, response) => {
  const id = request.params.employeeId;
  database('employees').where('id', id).first()
    .then( employee => {
      response.status(200).json(employee);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

//delete project
app.delete('/api/v1/projects/:projectId', checkAuth, (request, response) => {
  const id = request.params.projectId;
  database('projects').where('id', request.params.projectId).del()
    .then(result => {
      if (!result) {
        response.status(422).json({ error: `No Project with ID ${id}`});
      } else {
        response.sendStatus(204);
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

//delete employee
app.delete('/api/v1/employees/:employeeId', checkAuth, (request, response) => {
  const id = request.params.employeeId;
  database('employees').where('id', id).del()
    .then(result => {
      if (!result) {
        response.status(422).json({ error: `No Employee with ID ${id}`});
      } else {
        response.sendStatus(204);
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

//update project
app.patch('/api/v1/projects/:projectId', checkAuth, (request, response) => {
  const id = request.params.projectId;
  database('projects').where('id', id).update(request.body)
    .then(result => {
      if (!result) {
        response.status(422).json({ error: `No Project with ID ${id}`});
      } else {
        response.sendStatus(204);
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

//update employee
app.patch('/api/v1/employees/:employeeId', checkAuth, (request, response) => {
  const id = request.params.employeeId;
  database('employees').where('id', id).update(request.body)
    .then(result => {
      if (!result) {
        response.status(422).json({ error: `No Employee with ID ${id}`});
      } else {
        response.sendStatus(204);
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

//get all employees for a project
app.get('/api/v1/projects/:projectId/employees', (request, response) => {
  database('employees')
    .join('employees_projects', 'employees_projects.employee_id', 'employees.id')
    .where('employees_projects.project_id', request.params.projectId)
    .select('*')
    .then(employees => response.status(200).json(employees))
    .catch(error => {
      response.status(500).json({ error });
    });
});

//get all projects for an employee
app.get('/api/v1/employees/:employeeId/projects', (request, response) => {
  database('projects')
    .join('employees_projects', 'employees_projects.project_id', '=', 'projects.id')
    .where('employees_projects.employee_id', request.params.employeeId)
    .select('*')
    .then(projects => response.status(200).json(projects))
    .catch(error => {
      response.status(500).json({ error });
    });
});

// add employee to project
app.post('/api/v1/projects/:projectId/employees/:employeeId', checkAuth, (request, response) => {
  const project = request.params.projectId;
  const employee = request.params.employeeId;
  database('employees_projects').insert({
    employee_id: employee,
    project_id: project
  })
    .then(() => {
      response.sendStatus(204);
    })
    .catch(error => {
      response.status(422).json(error);
    });
});

//remove employee from project
app.delete('/api/v1/projects/:projectId/employees/:employeeId', checkAuth, (request, response) => {
  const project = request.params.projectId;
  const employee = request.params.employeeId;
  database('employees_projects')
    .where({
      employee_id: employee,
      project_id: project
    })
    .del()
    .then(result => {
      if (!result) {
        response.status(422).json({ error: 'No Employee/Project'});
      } else {
        response.sendStatus(204);
      }
    })
    .catch(error => {
      response.status(422).json(error);
    });
});

app.listen(app.get('port'), () => {
  // eslint-disable-next-line no-console
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
