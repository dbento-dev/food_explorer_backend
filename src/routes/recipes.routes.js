const { Router } = require('express')
const recipesRoutes = Router()
const RecipesController = require('../controllers/RecipesController')

const recipesController = new RecipesController()

recipesRoutes.post('/', recipesController.create)
recipesRoutes.get('/:id', recipesController.show)
recipesRoutes.delete('/:id', recipesController.delete)

module.exports = recipesRoutes
