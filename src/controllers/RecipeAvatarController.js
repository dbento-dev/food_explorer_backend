const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const DiskStorage = require('../providers/DiskStorage')

class RecipeAvatarController {
  async update(req, res) {
    const { id } = req.params
    const avatarFileName = req.file.filename

    const diskStorage = new DiskStorage()

    const recipe = await knex('recipes').where({ id }).first()

    if (!recipe) {
      throw new AppError('Receita não encontrada!', 404)
    }

    if (recipe.image) {
      await diskStorage.deleteFile(recipe.image)
    }

    const filename = await diskStorage.saveFile(avatarFileName)
    recipe.image = filename

    await knex('recipes').update(recipe).where({ id })

    return res.status(201).json({ message: 'Receita atualizada com sucesso!' })
  }
}

module.exports = RecipeAvatarController
