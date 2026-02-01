const express = require('express');
const router = express.Router();
const store = require('../lib/store');

// Mock data for demo - matches frontend expectations
const mockInvoicesByUser = {
  user_001: [
    {
      invoice_id: "inv_456789",
      amount: 1500.0,
      receiver_address: "0x742d35Cc6634C0532925a3b844Bc9e7595f10Ab3",
      description: "Outpatient Treatment - General Consultation",
      status: "pending",
      created_at: "2024-01-25T09:15:00Z",
    },
    {
      invoice_id: "inv_012345",
      amount: 3200.0,
      receiver_address: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
      description: "Emergency Room Visit - Minor Injury",
      status: "pending",
      created_at: "2024-01-28T16:20:00Z",
    },
  ],
  user_002: [
    {
      invoice_id: "inv_567890",
      amount: 850.0,
      receiver_address: "0x742d35Cc6634C0532925a3b844Bc9e7595f10Ab3",
      description: "Lab Tests - Blood Work",
      status: "pending",
      created_at: "2024-01-30T11:00:00Z",
    },
  ],
};

// Additional demo IDs reference user_001 data
mockInvoicesByUser.patient_no1 = mockInvoicesByUser.user_001;
mockInvoicesByUser.patient_001 = mockInvoicesByUser.user_001;
mockInvoicesByUser.patient_1 = mockInvoicesByUser.user_001;
mockInvoicesByUser.demo = mockInvoicesByUser.user_001;
mockInvoicesByUser.test = mockInvoicesByUser.user_001;

const mockInvoices = {
  inv_456789: mockInvoicesByUser.user_001[0],
  inv_012345: mockInvoicesByUser.user_001[1],
  inv_567890: mockInvoicesByUser.user_002[0],
};

// GET /api/invoices/user/:user_id - Get all invoices for a user (for hospital portal)
router.get('/user/:user_id', (req, res) => {
  const { user_id } = req.params;
  const invoices = mockInvoicesByUser[user_id] || [];
  res.json(invoices);
});

// GET /api/invoices/:invoice_id - Get a single invoice by ID (for Primus observation)
router.get('/:invoice_id', (req, res) => {
  const { invoice_id } = req.params;

  // Check mock data first
  if (mockInvoices[invoice_id]) {
    return res.json(mockInvoices[invoice_id]);
  }

  // Check store
  const existing = store.getInvoice(invoice_id);
  if (existing) {
    return res.json(existing);
  }

  res.status(404).json({ error: 'Invoice not found', invoice_id });
});

// Get or create invoice dynamic endpoint (original POST)
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
