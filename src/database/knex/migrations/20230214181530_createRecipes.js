exports.up = (knex) =>
  knex.schema.createTable('recipes', (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('category').notNullable()
    table.float('price').notNullable()
    table.string('description').notNullable()
    table.string('image')
  })

exports.down = (knex) => knex.schema.dropTable('recipes')
