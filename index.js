// env
require('dotenv').config();

// packages
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require('./lib/db');
const upload = require('express-fileupload');
const mm = require('./services/mm');
const receipt = require('./services/receipt');
const banking = require(`./services/moneybags`)

const app = express();
const port = 8080;

app.use(upload());
app.use(cookieParser());
app.use(cors());
// inject the token into req.query
app.use((req, res, next) => {
	if (req.cookies.token != null && req.query.token == null) {
		req.query.token = req.cookies.token;
		console.log('injecting into query');
		if (req.body != null && req.body.token == null) {
			console.log('injecting into body');
			req.body.token = req.cookies.token;
		}
	}
	next();
});

app.use('/mm', mm);
app.use('/receipt', receipt);
app.use('/claim', banking)

db.onReady(() => {
	app.listen(port, () => console.log(`server is listening on :${port}.`));
});
