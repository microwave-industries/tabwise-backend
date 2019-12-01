if (process.env.NODE_ENV !== `production`) {
  require(`dotenv`).config()
}

const express = require(`express`)
const db = require('../../lib/db')
const Truelayer = require(`../../lib/truelayer-client`)

const router = express.Router()

router.use(express.json())

router.post(`/submit`, async (req, res) => {
  const { items, token } = req.body
	const items_o = JSON.parse(items)
	const {users} = await db.claimItems(token, items_o)
	res.json({success: true, users});
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
