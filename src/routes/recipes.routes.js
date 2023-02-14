const { Router } = require('express')
const recipesRoutes = Router()
const RecipesController = require('../controllers/RecipesController')

const recipesController = new RecipesController()

recipesRoutes.post('/:user_id', recipesController.create)

module.exports = recipesRoutes
