const knex = require('../database/knex')

class RecipesController {
  async create(req, res) {
    const { name, category, ingredients, price, description } = req.body
    // const { user_id } = req.params

    const recipe_id = await knex('recipes').insert({
      name,
      category,
      // ingredients,
      price,
      description
      // user_id
    })

    const ingredientsInsert = ingredients.map((ingredient) => {
      return {
        recipe_id,
        name: ingredient
      }
    })

    await knex('ingredients').insert(ingredientsInsert)

    res.json()
  }

  async show(req, res) {
    const { id } = req.params
    const recipe = await knex('recipes').where({ id }).first()

    const ingredients = await knex('ingredients')
      .where({ recipe_id: id })
      .orderBy('name')

    return res.json({
      ...recipe,
      ingredients
    })
  }

  async delete(req, res) {
    const { id } = req.params

    await knex('recipes').where({ id }).delete()

    return res.json()
  }
}

module.exports = RecipesController
