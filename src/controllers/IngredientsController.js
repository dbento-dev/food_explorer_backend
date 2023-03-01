const knex = require('../database/knex')

class IngredientsController {
  async index(req, res) {
    const { recipe_id } = req.params

    const ingredients = await knex('ingredients').where({ recipe_id })

    return res.json(ingredients)
  }
}

module.exports = IngredientsController
