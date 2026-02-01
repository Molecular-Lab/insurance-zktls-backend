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

// Original routes (for backward compatibility)
app.use('/health/records', recordsRouter);
app.use('/health/invoices', invoicesRouter);
app.use('/templates', templatesRouter);
app.use('/claim', claimsRouter);

// New API routes (for frontend compatibility)
// These are the routes that Primus will observe
app.use('/api/records', recordsRouter);
app.use('/api/invoices', invoicesRouter);

app.get('/', (req, res) => res.json({ok: true, msg: 'Insurance zktls backend running'}));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`API endpoints available:`);
  console.log(`  GET  /api/records/:record_id`);
  console.log(`  GET  /api/records/user/:user_id`);
  console.log(`  GET  /api/invoices/:invoice_id`);
  console.log(`  GET  /api/invoices/user/:user_id`);
});
