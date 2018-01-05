
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
    }),

    knex.schema.createTable('hotwork', (table) => {
      table.increments('id').primary();
      table.integer('project_id');
      table.string('employee_email');
      table.string('employee_name');
      table.string('company');
      table.dateTime('date');
      table.string('firewatchRequirement');
      table.boolean('areaInspected');
      table.boolean('fireExtinguisher');
      table.boolean('flammablesRemoved');
      table.boolean('smokeDetectorsDisabled');
      table.boolean('sprinklerHeadsProtected');
      table.string('signature', 10485760);
    }),

    knex.schema.createTable('pretask', (table) => {
      table.increments('id').primary();
      table.integer('project_id');
      table.string('employee_email');
      table.string('employee_name');
      table.string('company');
      table.dateTime('date');
      table.integer('crewSize');
      table.boolean('tools');
      table.boolean('requireTraining');
      table.boolean('msdsReviewed');
      table.boolean('adequateLighting');
      table.boolean('weatherConditions');
      table.boolean('equipmentShutDown');
      table.boolean('impactOwner');
      table.boolean('planReview');
      table.boolean('fluidDischarge');
      table.boolean('subInvolvement');
      table.boolean('specialPermits');
      table.boolean('buddyAssignment');
      table.boolean('safetyLocations');
      table.boolean('lifting');
      table.string('hazards');
      table.binary('signature');
    })

  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('employees_projects'),
    knex.schema.dropTable('hotwork'),
    knex.schema.dropTable('pretask'),
    knex.schema.dropTable('projects'),
    knex.schema.dropTable('employees')
  ]);
};
