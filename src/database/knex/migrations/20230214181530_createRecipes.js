exports.up = (knex) =>
  knex.schema.createTable('recipes', (table) => {
    table.increments('id').primary()
    table.string('image').notNullable()
    table.string('name').notNullable()
    table
      .integer('category_id')
      .references('id')
      .inTable('categories')
      .onDelete('CASCADE')
    table
      .integer('ingredients_id')
      .references('id')
      .inTable('ingredients')
      .onDelete('CASCADE')
    table.float('price').notNullable()
    table.string('description').notNullable()
  })

exports.down = (knex) => knex.schema.dropTable('recipes')
