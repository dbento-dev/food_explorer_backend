exports.up = (knex) =>
  knex.schema.createTable('favorites', (table) => {
    table.increments('id').primary()
    table
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
    table
      .integer('recipe_id')
      .references('id')
      .inTable('recipes')
      .onDelete('CASCADE')
  })

exports.down = (knex) => knex.schema.dropTable('favorites')
