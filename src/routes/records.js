const express = require('express');
const router = express.Router();
const store = require('../lib/store');
const zktls = require('../lib/zktlsAdapter');

// Create / simulate a health check record
router.post('/:record_id', async (req, res) => {
  const { record_id } = req.params;
  const existing = store.getRecord(record_id);
  if (existing) return res.json(existing);

  // Create a simulated record — in real world the record would come from hospital
  const body = req.body || {};
  const record = store.createRecord(Object.assign({record_id}, body));

  // Sign record hash using zktls (stub)
  const signature = await zktls.signRecordHash(record.hash || 'pdf_hash_placeholder', {doc_id: record.doc_id});
  record.signature = signature.signature;

  res.json(record);
});

module.exports = router;
