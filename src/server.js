require('express-async-errors')

const migrationsRun = require('./database/sqlite/migrations')
const AppError = require('./utils/AppError')

const express = require('express')
const routes = require('./routes')

const uploadConfig = require('./configs/upload')

migrationsRun()

const app = express()
app.use(express.json())

app.use('/files', express.static(uploadConfig.UPLOADS_FOLDER))

app.use(routes)

app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    })
  }

  console.error(err)

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  })
})

const PORT = 3333
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
