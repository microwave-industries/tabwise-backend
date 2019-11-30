const express = require('express');
const upload = require('express-fileupload');
const router = express.Router();
const tabby = require('../lib/tabby');

tabby.init(process.env.TABSCANNER_API_KEY);

router.use(upload());

const cleanItems = (items) => {
 return items.map(x => {
  //rewrite fields
 	const splitLine = x.desc.split(' ');
	const qty = parseInt(splitLine[0].match(/\d+/g));
	const lineTotal = parseFloat(x.lineTotal);
	const price = lineTotal / qty;
	const descClean = x.desc.replace(/^\d+x?\s?(.*)(?:\s[0-9\.]+)?/gm, "$1");
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

router.post('/upload', async (req, res) => {
	console.log('file upload incoming');
	const file = req.files.file;
	if (file == null) {
		res.json({success: false, reason: 'file is missing.'});
	}
	console.log(`received file ${file.name} (${file.size} bytes)`);
	const token = await tabby.process(file.data, file.name, file.mimetype); 
	const results = await tabby.results(token);
	if (results.result.lineItems == null) {
		// forward error response
		res.json(results);
	}
	const items = cleanItems(results.result.lineItems);
	res.json({
		establishment: results.result.establishment,
		date: results.result.dateISO,
		items: items,
		total: parseFloat(results.result.total),
		charges: results.result.taxes,
		currency: results.result.currency
	});
});



router.get('/items', (req, res) => {

});

module.exports = router;