const express = require('express');

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
app.set('port', process.env.PORT || 3000);

app.locals.title = 'BYOB';

//get all projects
app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then(projects => {
      response.status(200).json(projects);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

//add new project
app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  for (let requiredParameter of ['name', 'location', 'union', 'lead_employee', 'public']) {
    if (!project[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String>, location: <String>, lead_employee: <String>, union: <Boolean>, public: <Boolean> }. You're missing a "${requiredParameter}" property.` });
    }
  }
  database('employees').where('name', project.lead_employee).first()
    .then(employee => {
      const newProject = Object.assign({}, project, { lead_employee: employee.id });
      database('projects').insert(newProject, 'id')
        .then(project => {
          response.status(201).json({ id: project[0] });
        })
        .catch(error => {
          response.status(500).json({ error });
        });
    });
});

//get all employee
app.get('/api/v1/employees', (request, response) => {
  database('employees').select()
    .then(employees => {
      response.status(200).json(employees);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

//add new employee
app.post('/api/v1/employees', (request, response) => {
  const employee = request.body;

  if (!employee.name){
    return response
      .status(422)
      .send({ error: 'Missing a name property.' });
  }

  database('employees').insert(employee, 'id')
    .then(employee => {
      response.status(201).json({ id: employee[0] });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

//delete project
app.delete('/api/v1/projects/:projectId', (request, response) => {
  const id = request.params.projectId;
  //need to delete other instances where an ID is first
  database('projects').where('id', id).del()
    .then( () => {
      return database('projects').where('id', id).del();
    })
    .then( () => {
      response.status(204).json({ id });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

//delete employee
app.delete('/api/v1/employees/:employeeId', (request, response) => {
  const id = request.params.employeeId;
  database('employees').where('id', id).del()
    .then( () => {
      response.status(204).send();
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

//update project
app.patch('/api/v1/projects/:projectId', (request, response) => {

});

//update employee
app.patch('/api/v1/employees/:employeeId', (request, response) => {

});

//get all employees for a project
app.get('/api/v1/projects/:projectId/employees', (request, response) => {
  database('employees').join('employees_projects', 'employees_projects.employee_id', '=', 'employees.id').where('employees_projects.project_id', request.params.projectId).select('*')
    .then(employees => response.status(200).json(employees))
    .catch(error => {
      response.status(500).json({ error });
    });
});

//get all projects for an employee
app.get('/api/v1/employees/:employeeId/projects', (request, response) => {
  database('employee').where('project_id', request.params.projectId).select()
    .then(palettes => response.status(200).json(palettes))
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.listen(app.get('port'), () => {
  // eslint-disable-next-line no-console
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
