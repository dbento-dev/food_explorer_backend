const knex = require('../database/knex')
const AppError = require('../utils/AppError')

class FavoritesController {
  async create(req, res) {
    const { user_id, recipe_id } = req.body

    const [user] = await knex('users').where({ id: user_id })
    const [recipe] = await knex('recipes').where({ id: recipe_id })

    if (!user) {
      throw new AppError('Usuário não encontrado!', 404)
    }

    if (!recipe) {
      throw new AppError('Prato não encontrado!', 404)
    }

    const [favoriteExists] = await knex('favorites').where({
      user_id,
      recipe_id
    })

    if (favoriteExists) {
      throw new AppError('Prato já está como favorito!', 400)
    }

    await knex('favorites').insert({
      user_id,
      recipe_id
    })

    return res.status(201).json({ message: 'Adicionado aos favoritos!' })
  }

  async delete(req, res) {
    const { id } = req.body

    const [favorites] = await knex('favorites').where({ id })

    if (!favorites) {
      throw new AppError('Prato favorito não foi encontrado!', 404)
    }

    await knex('favorites').where({ id }).delete()

    return res.status(201).json({ message: 'Removido dos favoritos!' })
  }

  async index(req, res) {
    const { user_id } = req.body

    let favorites = []

    favorites = await knex('favorites').where({ user_id })

    const allRecipes = await knex('recipes')

    const favoriteDetailList = favorites.map((favorite) => {
      const recipe = allRecipes.filter(
        (recipe) => recipe.id === favorite.recipe_id
      )

      return {
        ...favorite,
        favoriteRecipeDetail: recipe
      }
    })

    return res.json(favoriteDetailList)
  }
}

module.exports = FavoritesController
