const { Router } = require('express')

const FavoritesController = require('../controllers/FavoritesController')

const favoritesRoutes = Router()

const favoritesController = new FavoritesController()

favoritesRoutes.get('/', favoritesController.index)
favoritesRoutes.post('/', favoritesController.create)
favoritesRoutes.delete('/', favoritesController.delete)

module.exports = favoritesRoutes
