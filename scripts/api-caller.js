#!/usr/bin/env node
/*
 Simple API caller for the insurance-zktls-backend demo.

 Usage examples:
  node scripts/api-caller.js create-record rec123 '{"hash":"pdf_h1","doc_id":"docA","hospital_name":"Demo"}'
  node scripts/api-caller.js create-invoice inv123 '{"record_id":"rec123","transaction_id":"tx1","amount":100,"receiver_address":"0xReceiver"}'
  node scripts/api-caller.js create-template '{"name":"ClaimTemplate v1"}'
  node scripts/api-caller.js claim '{"user_wallet":"0xUser","template_id":"tpl_xxx","invoice_id":"inv123"}'
  node scripts/api-caller.js get-record rec123
  node scripts/api-caller.js get-invoice inv123
  node scripts/api-caller.js get-template tpl_xxx

 The script will try to use the global fetch if available, otherwise dynamically import 'node-fetch'.
*/

// Load .env into process.env if present
try { require('dotenv').config(); } catch (e) { /* dotenv optional */ }

(async function main(){
  if (!global.fetch) {
    try {
      const undici = await import('undici');
      // undici exports fetch
      global.fetch = undici.fetch;
    } catch (e) {
      console.error('Fetch not available and undici failed to import. Install undici or use Node 18+. Run: npm install undici');
      process.exit(1);
    }
  }

  const [,, cmd, idOrJson, maybeJson] = process.argv;
  const BASE = process.env.API_BASE || 'http://localhost:4000';
  console.log('Using API base URL:', BASE);

  function parseJsonOrArg(arg){
    if (!arg) return undefined;
    try { return JSON.parse(arg); } catch(e){ return arg; }
  }

  async function req(path, opts){
    const res = await fetch(BASE + path, opts);
    const text = await res.text();
    try { return JSON.parse(text); } catch(e){ return text; }
  }

  if (!cmd) {
    console.log('Usage: api-caller.js <command> <id?> <json?>');
    console.log('Commands: create-record, get-record, create-invoice, get-invoice, create-template, get-template, claim');
    process.exit(0);
  }

  try {
    if (cmd === 'create-record'){
      const recordId = idOrJson;
      const body = parseJsonOrArg(maybeJson) || {};
      if (!recordId) return console.error('record id required');
      const out = await req(`/health/records/${recordId}`, { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify(body)});
      console.log(JSON.stringify(out, null, 2));
    } else if (cmd === 'get-record'){
      const recordId = idOrJson;
      if (!recordId) return console.error('record id required');
      const out = await req(`/health/records/${recordId}`, { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({}) });
      console.log(JSON.stringify(out, null, 2));
    } else if (cmd === 'create-invoice'){
      const invoiceId = idOrJson;
      const body = parseJsonOrArg(maybeJson) || {};
      if (!invoiceId) return console.error('invoice id required');
      const out = await req(`/health/invoices/${invoiceId}`, { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify(body)});
      console.log(JSON.stringify(out, null, 2));
    } else if (cmd === 'get-invoice'){
      const invoiceId = idOrJson;
      if (!invoiceId) return console.error('invoice id required');
      // invoice endpoint only supports POST in demo; reuse POST with empty body to get existing
      const out = await req(`/health/invoices/${invoiceId}`, { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({}) });
      console.log(JSON.stringify(out, null, 2));
    } else if (cmd === 'create-template'){
      const body = parseJsonOrArg(idOrJson) || {};
      const out = await req(`/templates`, { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify(body)});
      console.log(JSON.stringify(out, null, 2));
    } else if (cmd === 'get-template'){
      const templateId = idOrJson;
      if (!templateId) return console.error('template id required');
      const out = await req(`/templates/${templateId}`, { method: 'GET' });
      console.log(JSON.stringify(out, null, 2));
    } else if (cmd === 'claim'){
      const body = parseJsonOrArg(idOrJson) || {};
      const out = await req(`/claim`, { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify(body)});
      console.log(JSON.stringify(out, null, 2));
    } else {
      console.error('Unknown command', cmd);
      process.exit(2);
    }
  } catch (e){
    console.error('Request failed:', e.message || e);
    process.exit(1);
  }

})();
