require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const recordsRouter = require('./routes/records');
const invoicesRouter = require('./routes/invoices');
const templatesRouter = require('./routes/templates');
const claimsRouter = require('./routes/claims');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/health/records', recordsRouter);
app.use('/health/invoices', invoicesRouter);
app.use('/templates', templatesRouter);
app.use('/claim', claimsRouter);

app.get('/', (req, res) => res.json({ok: true, msg: 'Insurance zktls backend running'}));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
