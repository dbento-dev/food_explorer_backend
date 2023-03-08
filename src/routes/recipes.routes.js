const { Router } = require('express')
const recipesRoutes = Router()
const RecipesController = require('../controllers/RecipesController')

const recipesController = new RecipesController()

const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

const multer = require('multer')
const uploadConfig = require('../configs/upload')

const upload = multer(uploadConfig.MULTER)

recipesRoutes.use(ensureAuthenticated)

recipesRoutes.post('/', recipesController.create)
recipesRoutes.get('/:id', recipesController.show)
recipesRoutes.delete('/:id', recipesController.delete)
recipesRoutes.get('/', recipesController.index)

recipesRoutes.patch('/:id', upload.single('image'), recipesController.update)

module.exports = recipesRoutes
