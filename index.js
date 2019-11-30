// env
require('dotenv').config();

// packages
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const mm = require('./services/mm');
const receipt = require('./services/receipt');
const claim = require('./services/claim');
const banking = require(`./services/moneybags`)

const app = express();
const port = 8080;

app.use(cookieParser());
app.use(cors());
// inject the token into req.query
app.use((req, res, next) => {
	if (req.cookies.token != null && req.query.token == null) {
		req.query.token = req.cookies.token;
		req.body.token = req.cookies.token;
	}
	next();
});

app.use('/mm', mm);
app.use('/receipt', receipt);
app.use('/claim', claim);
app.use(`/banking`, banking)

app.listen(port, () => console.log(`server is listening on :${port}.`));
