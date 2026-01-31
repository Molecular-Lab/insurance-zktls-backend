const fetch = require('node-fetch');

const BASE = 'http://localhost:4000';

async function wait(ms){ return new Promise(r=>setTimeout(r,ms)); }

async function run(){
  console.log('Ensure the server is running: npm run start');
  // Create a record
  const recordResp = await fetch(`${BASE}/health/records/rec123`, {
    method: 'POST',
    headers: {'content-type':'application/json'},
    body: JSON.stringify({ hash: 'pdf_h1', doc_id: 'docA', hospital_name: 'Demo Hospital' })
  });
  const record = await recordResp.json();
  console.log('record:', record);

  // Create invoice linked to record
  const invoiceResp = await fetch(`${BASE}/health/invoices/inv123`, {
    method: 'POST',
    headers: {'content-type':'application/json'},
    body: JSON.stringify({ record_id: record.record_id, transaction_id: 'bank_tx_1', amount: 150, receiver_address: '0xReceiver' })
  });
  const invoice = await invoiceResp.json();
  console.log('invoice:', invoice);

  // Create template manually
  const tplResp = await fetch(`${BASE}/templates`, {
    method: 'POST',
    headers: {'content-type':'application/json'},
    body: JSON.stringify({ name: 'ClaimTemplate v1', fields: ['record_id','invoice_id','amount'] })
  });
  const template = await tplResp.json();
  console.log('template:', template);

  // Buy package (simulate user purchase) - we don't have a dedicated route, simulate by creating user
  await fetch(`${BASE}/templates`); // noop to show more calls

  // Claim: user sends template_id and invoice_id
  const claimResp = await fetch(`${BASE}/claim`, {
    method: 'POST',
    headers: {'content-type':'application/json'},
    body: JSON.stringify({ user_wallet: '0xUserWallet', template_id: template.template_id, invoice_id: invoice.invoice_id, currency: 'USD' })
  });
  const claim = await claimResp.json();
  console.log('claim result:', claim);
}

run().catch(e=>{ console.error(e); process.exit(1); });
