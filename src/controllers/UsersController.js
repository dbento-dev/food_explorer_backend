const AppError = require('../utils/AppError')

class UsersController {
  /* 
    index -> list all users (GET)
    show -> show one user (GET)
    create -> create a new user (POST) 
    update -> update a user (PUT)
    delete -> delete a user (DELETE)  
  */

  create(req, res) {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      throw new AppError('Preencha todos os campos', 400)
    }

    res.status(201).json(`O usuário ${name} foi cadastrado com sucesso`)
  }
}

module.exports = UsersController
