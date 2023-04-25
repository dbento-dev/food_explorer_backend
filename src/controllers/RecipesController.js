const knex = require('../database/knex')
const DiskStorage = require('../providers/DiskStorage')
const AppError = require('../utils/AppError')

class RecipesController {
  async create(req, res) {
    // const user_id = req.user.id
    const { name, category, ingredients, price, description } = req.body
    const imageFileName = req.file.filename

    const diskStorage = new DiskStorage()

    const fileName = await diskStorage.saveFile(imageFileName)

    const [recipe_id] = await knex('recipes').insert({
      image: fileName,
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

    return res.status(201).json({ message: 'Prato criado com sucesso!' })
  }

  async update(req, res) {
    const { id } = req.params
    const { name, category, ingredients, price, description } = req.body

    const recipe = await knex('recipes').where({ id }).first()

    if (!recipe) {
      throw new AppError('Recipe not found', 404)
    }

    recipe.name = name ?? recipe.name
    recipe.category = category ?? recipe.category
    recipe.price = price ?? recipe.price
    recipe.description = description ?? recipe.description

    await knex('recipes').update(recipe).where({ id })

    const hasOnlyOneIngredient = typeof ingredients === 'string'

    let ingredientsToInsert

    if (hasOnlyOneIngredient) {
      ingredientsToInsert = {
        name: ingredients,
        recipe_id: id
      }
    } else {
      ingredientsToInsert = ingredients.map((ingredient) => {
        return {
          recipe_id: id,
          name: ingredient
        }
      })
    }

    await knex('ingredients').where({ recipe_id: id }).delete()
    await knex('ingredients')
      .where({ recipe_id: id })
      .insert(ingredientsToInsert)

    return res.status(201).json({ message: 'Recipe updated successfully' })
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
        .groupBy('recipes.id')
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
