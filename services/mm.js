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

router.get('/update', async (req, res) => {
	const {token} = req.query;
	const data = await db.queryRoom(token);
	// check if all ok
	const idxs = data.users.map(x => x.items).flat(1).sort();
	const exps = data.items.map((x, i) => Array(x.qty).fill(i)).flat(1).sort();
	let diff = [], ldx = 0;
	for (let i=0;i<exps.length;i++) {
		if (exps[i] != idxs[ldx]) diff.push(exps[i]);
		else ldx++;
	}
	res.json({success: true, ...data, complete: diff.length == 0, diff});
});

module.exports = router;
