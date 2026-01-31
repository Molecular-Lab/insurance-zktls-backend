const { v4: uuidv4 } = require('uuid');

// Simple in-memory store for demo purposes.
const records = new Map(); // record_id => record
const invoices = new Map(); // invoice_id => invoice
const templates = new Map(); // template_id => template
const users = new Map(); // wallet => user data

function createRecord(data) {
  const id = data.record_id || uuidv4();
  const rec = Object.assign({record_id: id, checked: true, dt: new Date().toISOString()}, data);
  records.set(id, rec);
  return rec;
}

function getRecord(id) {
  return records.get(id) || null;
}

function createInvoice(data) {
  const id = data.invoice_id || uuidv4();
  const inv = Object.assign({invoice_id: id, dt: new Date().toISOString()}, data);
  invoices.set(id, inv);
  return inv;
}

function getInvoice(id) {
  return invoices.get(id) || null;
}

function createTemplate(data) {
  const id = data.template_id || uuidv4();
  const t = Object.assign({template_id: id, created_at: new Date().toISOString()}, data);
  templates.set(id, t);
  return t;
}

function getTemplate(id) {
  return templates.get(id) || null;
}

function createUser(wallet, data) {
  users.set(wallet, Object.assign({wallet, created_at: new Date().toISOString()}, data || {}));
  return users.get(wallet);
}

function getUser(wallet) {
  return users.get(wallet) || null;
}

module.exports = {
  createRecord, getRecord,
  createInvoice, getInvoice,
  createTemplate, getTemplate,
  createUser, getUser,
};
