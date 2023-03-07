const { Router } = require('express')
const IngredientsController = require('../controllers/IngredientsController')

const ingredientsRoutes = Router()
const ingredientsController = new IngredientsController()

const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

ingredientsRoutes.get(
  '/:recipe_id',
  ensureAuthenticated,
  ingredientsController.index
)

module.exports = ingredientsRoutes
