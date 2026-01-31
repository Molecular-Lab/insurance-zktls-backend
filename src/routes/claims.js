const express = require('express');
const router = express.Router();
const store = require('../lib/store');
const zktls = require('../lib/zktlsAdapter');

/**
 * Claim flow
 * POST /claim
 * body: { user_wallet, template_id, invoice_id, currency }
 * Steps:
 *  - Validate invoice and record
 *  - Verify template exists
 *  - Verify zktls signature on record (stub)
 *  - Simulate creation of payout transaction details and return tx data
 */
router.post('/', async (req, res) => {
  const { user_wallet, template_id, invoice_id, currency } = req.body || {};
  if (!user_wallet || !template_id || !invoice_id) return res.status(400).json({error: 'missing required fields'});

  const template = store.getTemplate(template_id);
  if (!template) return res.status(404).json({error: 'template not found'});

  const invoice = store.getInvoice(invoice_id);
  if (!invoice) return res.status(404).json({error: 'invoice not found'});

  const record = store.getRecord(invoice.record_id);
  if (!record) return res.status(404).json({error: 'record not found for invoice'});

  // Verify record signature via zktls adapter (stubbed)
  const verify = await zktls.verifySignature(record.hash || 'pdf_hash_placeholder', record.signature);
  if (!verify.valid) return res.status(400).json({error: 'invalid record signature'});

  // Simulate creation of transaction to pay user (or receiver address provided by hospital)
  const tx = {
    tx_id: `tx_${Math.random().toString(36).slice(2,9)}`,
    amount: invoice.amount || 0,
    currency: currency || 'USD',
    receiver_address: invoice.receiver_address || user_wallet,
    status: 'created',
    template_id,
    invoice_id
  };

  // In a real implementation we'd sign/send the blockchain transaction here and record the tx
  res.json({ claim: true, tx });
});

module.exports = router;
