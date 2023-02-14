const { hash, compare } = require('bcrypt')
const AppError = require('../utils/AppError')
const sqliteConnection = require('../database/sqlite')

class UsersController {
  /* 
    index -> list all users (GET)
    show -> show one user (GET)
    create -> create a new user (POST) 
    update -> update a user (PUT)
    delete -> delete a user (DELETE)  
  */

  async create(req, res) {
    const { name, email, password } = req.body

    const db = await sqliteConnection()
    const userExists = await db.get('SELECT * FROM users WHERE email = (?)', [
      email
    ])

    if (userExists) {
      throw new AppError('User already exists', 400)
    }

    const hashedPassword = await hash(password, 8)

    await db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
      name,
      email,
      hashedPassword
    ])

    return res.status(201).json({ message: 'User created successfully' })
  }

  async update(req, res) {
    const { id } = req.params
    const { name, email, password, old_password } = req.body

    const db = await sqliteConnection()

    const user = await db.get('SELECT * FROM users WHERE id = (?)', [id])

    if (!user) {
      throw new AppError('User not found', 404)
    }

    const userWithUpdatedEmail = await db.get(
      'SELECT * FROM users WHERE email = (?)',
      [email]
    )

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError('Email already in use', 400)
    }

    user.name = name ?? user.name
    user.email = email ?? user.email

    if (password && !old_password) {
      throw new AppError(
        'You need to inform the old password to set a new password',
        400
      )
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password)

      if (!checkOldPassword) {
        throw new AppError('Old password does not match', 400)
      }

      user.password = await hash(password, 8)
    }

    await db.run(
      `UPDATE users SET name = (?), email = (?), password = (?), updated_at = DATETIME('now') WHERE id = (?)`,
      [user.name, user.email, user.password, user.id]
    )

    return res.status(200).json({ message: 'User updated successfully' })
  }
}

module.exports = UsersController
