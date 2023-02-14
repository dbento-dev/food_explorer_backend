exports.up = (knex) =>
  knex.schema.createTable('recipes', (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('category').notNullable()
    // table.string('ingredients').notNullable()
    table.float('price').notNullable()
    table.string('description').notNullable()
    table.string('image')
    // table
    //   .integer('user_id')
    //   .references('id')
    //   .inTable('users')
    //   .onDelete('CASCADE')
  })

exports.down = (knex) => knex.schema.dropTable('recipes')
