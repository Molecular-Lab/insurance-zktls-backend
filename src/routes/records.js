const express = require('express');
const router = express.Router();
const store = require('../lib/store');
const zktls = require('../lib/zktlsAdapter');

// Mock data for demo - matches frontend expectations
// Includes Primus zkTLS attestation fields (health_info, doctor_signature, document_hash)
const mockRecordsByUser = {
  user_001: [
    {
      record_id: "rec_123456",
      hospital_name: "Bangkok General Hospital",
      patient_name: "John Doe",
      diagnosis: "Annual Checkup - Healthy",
      status: "healthy",
      vitals: {
        blood_pressure: "120/80",
        heart_rate: 72,
        bmi: 22.5,
        cholesterol: 180,
      },
      created_at: "2024-01-15T10:30:00Z",
      // Primus zkTLS attestation fields
      health_info: "Patient is in good health. All vitals within normal range. No chronic conditions.",
      doctor_signature: "0x7a8f3b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c",
      document_hash: "0xabc123def456789abc123def456789abc123def456789abc123def456789abcd",
    },
  ],
  user_002: [
    {
      record_id: "rec_789012",
      hospital_name: "Chiang Mai Medical Center",
      patient_name: "Jane Smith",
      diagnosis: "Minor Treatment - Cold/Flu",
      status: "minor",
      vitals: {
        blood_pressure: "118/75",
        heart_rate: 68,
        bmi: 21.2,
        cholesterol: 165,
      },
      created_at: "2024-01-20T14:45:00Z",
      // Primus zkTLS attestation fields
      health_info: "Minor respiratory infection. Treatment prescribed. Expected full recovery.",
      doctor_signature: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
      document_hash: "0xdef789abc123456def789abc123456def789abc123456def789abc123456defg",
    },
  ],
};

// Additional demo IDs reference user_001 data
mockRecordsByUser.patient_no1 = mockRecordsByUser.user_001;
mockRecordsByUser.patient_001 = mockRecordsByUser.user_001;
mockRecordsByUser.patient_1 = mockRecordsByUser.user_001;
mockRecordsByUser.demo = mockRecordsByUser.user_001;
mockRecordsByUser.test = mockRecordsByUser.user_001;

const mockRecords = {
  rec_123456: mockRecordsByUser.user_001[0],
  rec_789012: mockRecordsByUser.user_002[0],
};

// GET /api/records/:user_id - Get all records for a user (for hospital portal)
router.get('/user/:user_id', (req, res) => {
  const { user_id } = req.params;
  const records = mockRecordsByUser[user_id] || [];
  res.json(records);
});

// GET /api/records/:record_id - Get a single record by ID (for Primus observation)
router.get('/:record_id', (req, res) => {
  const { record_id } = req.params;

  // Check mock data first
  if (mockRecords[record_id]) {
    return res.json(mockRecords[record_id]);
  }

  // Check store
  const existing = store.getRecord(record_id);
  if (existing) {
    return res.json(existing);
  }

  res.status(404).json({ error: 'Record not found', record_id });
});

// Create / simulate a health check record (original endpoint)
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
