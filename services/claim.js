const express = require('express');
const upload = require('express-fileupload');
const router = express.Router();

router.use(upload());

router.post('/submit', (req, res) => {
	const {options, token} = req.body;
});

router.get('/pay', (req, res) => {

});

router.get('/callback', (req, res) => {

});

module.exports = router;
