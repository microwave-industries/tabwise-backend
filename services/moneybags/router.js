if (process.env.NODE_ENV !== `production`) {
  require(`dotenv`).config()
}

const express = require(`express`)
const Truelayer = require(`../../lib/truelayer-client`)

const router = express.Router()

router.use(express.json())

router.post(`/submit`, async (req, res) => {
  const { items, token } = req.body
  return true
})

router.get(`/pay`, async (req, res) => {
  const {
    monzoUsername,
    amount,
    description
  } = req.query
  return `https://monzo.me/${monzoUsername}/${amount}?d=${description}`
  console.log(await Truelayer.Auth.getClientCredentialsGrant())
})

module.exports = router
