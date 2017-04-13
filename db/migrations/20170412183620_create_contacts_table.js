exports.up = function(knex, Promise) {
  return knex.schema.createTable('contacts', (table) => {
    table.increments();
    table.integer('address_id').notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('phone_number').notNullable();
    table.string('email_address').notNullable();
    table.string('image_url').notNullable();
    table.timestamps(true,true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('contacts')
};
