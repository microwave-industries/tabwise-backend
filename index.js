// env
require('dotenv').config();

// packages
const express = require('express');
const mm = require('./services/mm');
const receipt = require('./services/receipt');
const claim = require('./services/claim');
const banking = require(`./services/moneybags`)

const app = express();
const port = 8080;

app.use('/mm', mm);
app.use('/receipt', receipt);
app.use('/claim', claim);
app.use(`/banking`, banking)

app.listen(port, () => console.log(`server is listening on :${port}.`));
