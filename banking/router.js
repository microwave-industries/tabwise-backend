if (process.env.NODE_ENV !== `production`) {
  require(`dotenv`).config()
}

const express = require(`express`)
const Truelayer = require(`./truelayer-client`)

const router = express.Router()

router.get(`/pay`, async (req, res) => {
  console.log(await Truelayer.Auth.getClientCredentialsGrant())
})

module.exports = router