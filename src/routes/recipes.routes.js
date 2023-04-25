const { Router } = require('express')
const recipesRoutes = Router()
const RecipesController = require('../controllers/RecipesController')

const RecipeAvatarController = require('../controllers/RecipeAvatarController')

const recipesController = new RecipesController()

const recipeAvatarController = new RecipeAvatarController()

const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

const multer = require('multer')
const uploadConfig = require('../configs/upload')

const upload = multer(uploadConfig.MULTER)

recipesRoutes.use(ensureAuthenticated)

recipesRoutes.post('/', upload.single('image'), recipesController.create)
recipesRoutes.get('/:id', recipesController.show)
recipesRoutes.delete('/:id', recipesController.delete)
recipesRoutes.get('/', recipesController.index)

recipesRoutes.put('/:id', upload.single('image'), recipesController.update)

recipesRoutes.patch(
  '/:id',
  upload.single('image'),
  recipeAvatarController.update
)

module.exports = recipesRoutes
