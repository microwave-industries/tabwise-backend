if (process.env.NODE_ENV !== `production`) {
  require(`dotenv`).config()
}

const express = require(`express`)
const db = require('../../lib/db')
const Truelayer = require(`../../lib/truelayer-client`)

const router = express.Router()

const MONZO_FORMAT = 'https://monzo.me/{username}/{amount}?d={desc}';
const MONZO_REGEX = /^https:\/\/monzo\.me\/([a-zA-Z0-9]+)\/?(.*)$/gi;
const STARLING_FORMAT = 'https://settleup.starlingbank.com/{username}?amount={amount}&message={desc}';
const STARLING_REGEX = /^https:\/\/settleup\.starlingbank\.com\/([a-zA-Z0-9]+)\?(.*)$/gi;


router.use(express.json())

router.post(`/submit`, async (req, res) => {
  const { items } = req.body
	const token = req.body.token || req.cookies.token
	const items_o = JSON.parse(items)
	const {users} = await db.claimItems(token, items_o)
	res.json({success: true, users});
  return true
})

router.get(`/pay`, async (req, res) => {
	const token = req.body.token || req.cookies.token;
  const {
    amount,
    description
  } = req.query
  const template = await db.getPaymentInfo(token)
	res.json({success: true, url: template.replace('{amount}', amount).replace('{desc}', description)});
  //console.log(await Truelayer.Auth.getClientCredentialsGrant())
})

router.get('/details', async (req, res) => {
	const token = req.body.token || req.cookies.token;
	const { paymentUrl } = req.query;
	if (mon = MONZO_REGEX.exec(paymentUrl)) {
			const username = mon[1];
			await db.attachPaymentInfo(token, MONZO_FORMAT.replace('{username}', username));
			res.json({success: true});
	} else if (star = STARLING_REGEX.exec(paymentUrl)) {
			const username = star[1];
			await db.attachPaymentInfo(token, STARLING_FORMAT.replace('{username}', username));
			res.json({success: true});
	} else res.json({success: false, reason: 'unknown payment url type'});
});

module.exports = router
