
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('employees', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.string('position');
      table.string('email');
      table.string('phone');
    }),

    knex.schema.createTable('projects', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.string('location');
      table.boolean('union');
      table.integer('lead_employee')
        .unsigned()
        .references('employees.id')
        .onDelete('CASCADE');
      table.boolean('public');
    }),

    knex.schema.createTable('employees_projects', (table) => {
      table.integer('project_id')
        .unsigned()
        .references('projects.id')
        .onDelete('CASCADE');
      table.integer('employee_id')
        .unsigned()
        .references('employees.id')
        .onDelete('CASCADE');
    })


  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('employees_projects'),
    knex.schema.dropTable('projects'),
    knex.schema.dropTable('employees')

  ]);
};
