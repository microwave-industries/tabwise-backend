const express = require(`express`)

const app = express()

const router = require(`./router`)

const PORT = 5000

app.use(router)

app.listen(
  PORT,
  () => {
    console.log(`Banking API listening on ${PORT}`)
  }
)