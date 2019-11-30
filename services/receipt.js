const express = require('express');
const upload = require('express-fileupload');
const router = express.Router();
const tabby = require('../lib/tabby');

tabby.init(process.env.TABSCANNER_API_KEY);

router.use(upload());


router.post('/upload', async (req, res) => {
	console.log('file upload incoming');
	const file = req.files.file;
	if (file == null) {
		res.json({success: false, reason: 'file is missing.'});
	}
	console.log(`received file ${file.name} (${file.size} bytes)`);
	const token = await tabby.process(file.data, file.name, file.mimetype); 
	const results = await tabby.results(token);
	res.json(results);
});



router.get('/items', (req, res) => {

});

module.exports = router;
