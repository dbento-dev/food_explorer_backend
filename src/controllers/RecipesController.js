const knex = require('../database/knex')

class RecipesController {
  async create(req, res) {
    const user_id = req.user.id
    const { name, category, ingredients, price, description } = req.body

    const recipe_id = await knex('recipes').insert({
      name,
      category,
      price,
      description
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

  async index(req, res) {
    const user_id = req.user.id
    const { filter } = req.query

    let recipes = []

    // filter by ingredients
    if (filter) {
      recipes = await knex('ingredients')
        // .select(['recipes.id', 'recipes.name'])
        .whereLike('ingredients.name', `%${filter}%`)
        .innerJoin('recipes', 'recipes.id', 'ingredients.recipe_id')
        .orderBy('recipes.id')
    }
    // filter by recipe name
    if (filter && recipes.length === 0) {
      recipes = await knex('recipes')
        .whereLike('name', `%${filter}%`)
        .orderBy('id')
    }
    // filter when there is no filter
    if (!filter) {
      recipes = await knex('recipes')
        .whereLike('name', `%${filter}%`)
        .orderBy('id')
    }

    const allIngredients = await knex('ingredients')

    const recipesWithIngredients = recipes.map((recipe) => {
      const recipeIngredients = allIngredients.filter(
        (_recipe) => _recipe.recipe_id === recipe.id
      )

      return {
        ...recipe,
        ingredients: recipeIngredients
      }
    })

    return res.json(recipesWithIngredients)
  }
}

module.exports = RecipesController
