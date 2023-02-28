const { Router } = require('express')
const recipesRoutes = Router()
const RecipesController = require('../controllers/RecipesController')

const recipesController = new RecipesController()

const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

recipesRoutes.use(ensureAuthenticated)

recipesRoutes.post('/', recipesController.create)
recipesRoutes.get('/:id', recipesController.show)
recipesRoutes.delete('/:id', recipesController.delete)
recipesRoutes.get('/', recipesController.index)

module.exports = recipesRoutes
