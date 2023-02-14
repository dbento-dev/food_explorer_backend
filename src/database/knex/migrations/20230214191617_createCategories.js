exports.up = (knex) =>
  knex.schema.createTable('categories', (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table
      .integer('recipes_id')
      .references('id')
      .inTable('recipes')
      .onDelete('CASCADE')
  })

exports.down = (knex) => knex.schema.dropTable('categories')
