const express = require('express');
const generate = require('project-name-generator');
const router = express.Router();

router.get('/create', (req, res) => {
	// generating room names: 
	// generate().dashed
});

router.get('/join', (req, res) => {

});

module.exports = router;
