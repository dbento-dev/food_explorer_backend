const knex = require('../database/knex')

class RecipesController {
  async create(req, res) {
    const { name, category, ingredients, price, description } = req.body
    const { user_id } = req.params

    const recipe_id = await knex('recipes').insert({
      name,
      category,
      ingredients,
      price,
      description,
      user_id
    })

    const ingredientsInsert = ingredients.map((ingredient) => {
      return {
        recipe_id,
        ingredient
      }
    })

    await knex('ingredients').insert(ingredientsInsert)
  }
}

module.exports = RecipesController
