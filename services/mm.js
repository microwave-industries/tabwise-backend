const express = require('express');
const router = express.Router();

const db = require('../lib/db');

router.get('/join', async (req, res) => {
	const {code, name} = req.query;

	const {uid, items, place, date, total} = await db.joinRoom(code, name);
	
	//set cookie
	res.cookie('token', uid);
	res.json({success: true, token: uid, items, place, date, total});
});

module.exports = router;
