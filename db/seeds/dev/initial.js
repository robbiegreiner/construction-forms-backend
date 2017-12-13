const fs = require('fs');

const employeeData = fs.readFileSync('./db/seeds/dev/employees.tsv', 'utf8');
const projectData = fs.readFileSync('./db/seeds/dev/projects.tsv', 'utf8');
const employeeProjectData = fs.readFileSync('./db/seeds/dev/employees_projects.tsv', 'utf8');

const parser = (data) => {
  const allLines = data.split(/\r\n|\n/);
  const headers = allLines.shift().split('\t');

  return allLines.map(line => line.split('\t')).map(row => {
    return row.reduce((accum, column, i) => {
      const cleanColumn = column.replace(/[''"]+/g, '');
      if (!cleanColumn) {
        return;
      }
      return Object.assign(accum, { [headers[i]]: cleanColumn });
    }, {});
  });
};

exports.seed = function(knex, Promise) {
  return knex('employees_projects').del()
    .then(() => knex('projects').del())
    .then(() => knex('employees').del())
    .then(() => {
      // Inserts seed entries
      return knex('employees').insert(parser(employeeData));
    })
    .then(() => {
      let projectsPromises =  parser(projectData).map(project => {
        return createProject(knex, project, project.lead_employee);
      });
      return Promise.all(projectsPromises);
    })
    .then(() => {
      let joinPromises =  parser(employeeProjectData).map(join => {
        return createJoin(knex, join.project_id, join.employee_id);
      });
      return Promise.all(joinPromises);
    });
};
const createJoin = (knex, project, employee) => {
  let joinRecord = {};
  return knex('employees').where('name', employee).first()
    .then(employeeRecord => joinRecord.employee_id = employeeRecord.id)
    .then(() => knex('projects').where('name', project).first())
    .then(projectRecord => joinRecord.project_id = projectRecord.id)
    .then(() => knex('employees_projects').insert(joinRecord));
};
const createProject = (knex, project, employee) => {
  return knex('employees').where('name', employee).first()
    .then((employeeRecord) => {
      return knex('projects').insert({
        name: project.name,
        location: project.location,
        union: project.union,
        public: project.public,
        lead_employee: employeeRecord.id
      });
    });
};
