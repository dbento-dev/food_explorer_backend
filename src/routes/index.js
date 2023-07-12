const Router = require('express')
const usersRoutes = require('./users.routes')
const recipesRoutes = require('./recipes.routes')
const sessionsRoutes = require('./sessions.routes')
const ingredientsRoutes = require('./ingredients.routes')
const favoritesRoutes = require('./favorites.routes')

const routes = Router()

routes.use('/users', usersRoutes)
routes.use('/sessions', sessionsRoutes)
routes.use('/recipes', recipesRoutes)
routes.use('/ingredients', ingredientsRoutes)
routes.use('/favorites', favoritesRoutes)

module.exports = routes
