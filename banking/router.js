if (process.env.NODE_ENV !== `production`) {
  require(`dotenv`).config()
}

const express = require(`express`)
const Truelayer = require(`./truelayer-client`)

const router = express.Router()

router.use(express.json())

router.post(`/submit`, async (req, res) => {
  const { items, token } = req.body
  return true
})

router.get(`/pay`, async (req, res) => {

  return `https://monzo.me/leehuey/55.00?d=Bleh`
  console.log(await Truelayer.Auth.getClientCredentialsGrant())
})

module.exports = router