const { verify } = require('jsonwebtoken')
const AppError = require('../utils/AppError')
const authConfig = require('../config/auth')

function ensureAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    throw new AppError('JWT token não encontrado', 401)
  }

  const [, token] = authHeader.split(' ')

  try {
    const { sub: user_id } = verify(token, authConfig.jwt.secret)

    req.user = {
      id: Number(user_id)
    }

    return next()
  } catch (err) {
    throw new AppError('JWT token inválido.', 401)
  }
}

module.exports = ensureAuthenticated
