const Router = require('express')
const usersRoutes = require('./users.routes')
const recipesRoutes = require('./recipes.routes')

const routes = Router()

routes.use('/users', usersRoutes)
routes.use('/recipes', recipesRoutes)

module.exports = routes
