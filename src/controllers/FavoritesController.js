const knex = require('../database/knex')
const AppError = require('../utils/AppError')

class FavoritesController {
  async create(req, res) {
    const user_id = req.user.id
    const { recipe_id } = req.body

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
    const user_id = req.user.id
    const { favorite_id } = req.query

    if (!user_id) {
      throw new AppError('Usuário não encontrado!', 404)
    }

    const [favorite] = await knex('favorites').where({
      user_id,
      recipe_id: favorite_id
    })

    if (!favorite) {
      return
    }

    const { id } = favorite

    await knex('favorites').where({ id }).delete()

    return res.status(200).json({ message: 'Removido dos favoritos!' })
  }

  async index(req, res) {
    const user_id = req.user.id

    if (!user_id) {
      throw new AppError('Usuário não encontrado!', 404)
    }

    let favorites = []

    favorites = await knex('favorites').where({ user_id })

    const allRecipes = await knex('recipes')

    const favoriteDetailList = favorites.map((favorite) => {
      const recipe = allRecipes.filter(
        (recipe) => recipe.id === favorite.recipe_id
      )

      return {
        ...recipe[0],
        ...favorite
      }
    })

    return res.json(favoriteDetailList)
  }
}

module.exports = FavoritesController
