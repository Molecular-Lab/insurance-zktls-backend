const express = require('express');
const router = express.Router();
const store = require('../lib/store');

// Get or create invoice dynamic endpoint
router.post('/:invoice_id', (req, res) => {
  const { invoice_id } = req.params;
  const existing = store.getInvoice(invoice_id);
  if (existing) return res.json(existing);

  const body = req.body || {};
  const invoice = store.createInvoice(Object.assign({invoice_id}, body));
  // expected fields: record_id, transaction_id, amount, receiver_address
  res.json(invoice);
});

module.exports = router;
