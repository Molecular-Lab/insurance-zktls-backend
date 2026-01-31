const express = require('express');
const router = express.Router();
const store = require('../lib/store');
const zktls = require('../lib/zktlsAdapter');

// Create a template manually
router.post('/', async (req, res) => {
  const body = req.body || {};
  // create template in zktls (adapter stub)
  const tpl = await zktls.createTemplate(body);
  const saved = store.createTemplate(tpl);
  res.json(saved);
});

// get template
router.get('/:template_id', (req, res) => {
  const t = store.getTemplate(req.params.template_id);
  if (!t) return res.status(404).json({error: 'template not found'});
  res.json(t);
});

module.exports = router;
