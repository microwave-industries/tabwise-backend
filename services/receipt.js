const express = require('express');
const router = express.Router();
const tabby = require('../lib/tabby');
const db = require('../lib/db');

tabby.init(process.env.TABSCANNER_API_KEY);

const cleanItems = (items) => {
 return items.map(x => {
  //rewrite fields
 	const splitLine = x.desc.split(' ');
	const qty = parseInt(splitLine[0].match(/\d+/g));
	const lineTotal = parseFloat(x.lineTotal);
	const price = lineTotal / qty;
	const stripEnd = x.desc.replace(/(?:\s[0-9\.,]+)$/gm, '');
	const descClean = stripEnd.replace(/^\d+x?\s?(.*)/gm, "$1").replace(/[^a-zA-Z0-9 ]/g, '');
	x.qty = qty;
	x.price = price;
	x.lineTotal = lineTotal;
	x.desc = descClean;
	x.descClean = descClean;

	// delete unnecessary fields
	delete x.unit;
	delete x.symbols;
	delete x.discount;
	delete x.productCode;
	delete x.customFields;
	delete x.lineType;

	if (x.supplementaryLineItems != null && x.supplementaryLineItems.below.length > 0) {
		x.subItems = x.supplementaryLineItems.below.map(x => {return {
			desc: x.desc,
			lineTotal: parseFloat(x.lineTotal)
		}});
	}
	delete x.supplementaryLineItems;
	return x;
 });
}

const MONZO_FORMAT = 'https://monzo.me/{username}/{amount}?d={desc}';
const MONZO_REGEX = /^https:\/\/monzo\.me\/([a-zA-Z0-9]+)\/?(.*)$/gi;
const STARLING_FORMAT = 'https://settleup.starlingbank.com/{username}?amount={amount}&message={desc}';
const STARLING_REGEX = /^https:\/\/settleup\.starlingbank\.com\/([a-zA-Z0-9]+)\?(.*)$/gi;

router.post('/upload', async (req, res) => {
	console.log('file upload incoming');
	const {file} = req.files;
	const {paymentUrl} = req.body;
	if (file == null) {
		res.json({success: false, reason: 'file is missing.'});
	}
	if (paymentUrl == null) {
		res.json({success: false, reason: 'paymentUrl is missing'});
	}

	// parse paymentUrl
	let name = 'unknown';
	let templateUrl = '';
	if (mon = MONZO_REGEX.exec(paymentUrl)) {
		name = mon[1];
		templateUrl = MONZO_FORMAT.replace('{username}', name);
	} else if (star = STARLING_REGEX.exec(paymentUrl)) {
		name = star[1];
		templateUrl = STARLING_FORMAT.replace('{username}', name);
	} else return res.json({success: false, reason: 'unknown payment url type'});

	MONZO_REGEX.exec('');
	STARLING_REGEX.exec('');

	console.log(`received file ${file.name} (${file.size} bytes)`);
	const token = await tabby.process(file.data, file.name, file.mimetype); 
	const results = await tabby.results(token);
	if (results.result == null || results.result.lineItems == null) {
		// forward error response
		res.json(results);
	}
	const total = parseFloat(results.result.total);
	const items = cleanItems(results.result.lineItems).filter(x => x.lineTotal <= total);

	// create the room
	const data = {
		place: results.result.establishment,
		date: results.result.dateISO,
		items,
		total,
		charges: results.result.taxes.map(k => {return {percentage: Math.round(k * 1000 / results.result.subTotal) / 10, amount: k}}),
		currency: results.result.currency
	};
	const {uid, code} = await db.createRoom(name, data, templateUrl);
	
	res.cookie('token', uid);
	res.json({success: true, token: uid, code, items, date: data.date, place: data.place, total: data.total, charges: data.charges});
});

module.exports = router;
