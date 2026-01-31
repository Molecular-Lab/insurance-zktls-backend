/**
 * zktlsAdapter.js
 *
 * This file provides a small adapter layer for PrimusLabs zktls integration.
 * For now it contains stubs that simulate signing/verifying and template creation.
 * Replace these stubs with real SDK calls and proper key management when integrating.
 *
 * Assumptions:
 * - The real PrimusLabs SDK exposes methods to create a template, sign a PDF/hash, and verify.
 * - SDK credentials should be loaded from environment variables.
 */

async function createTemplate(manualData) {
  // TODO: call real SDK to create a template; for now return a simulated template id
  return { templateId: `tpl_${Math.random().toString(36).slice(2,9)}`, ...manualData };
}

async function signRecordHash(recordHash, signerInfo) {
  // TODO: call zktls signing endpoint with SDK
  // Simulated signature
  return {
    signature: `sig_${Buffer.from(recordHash).toString('hex').slice(0,32)}`,
    signer: signerInfo || 'hospital_stub'
  };
}

async function verifySignature(recordHash, signature) {
  // TODO: call SDK verify
  // Simulate always valid
  return { valid: true };
}

module.exports = {
  createTemplate,
  signRecordHash,
  verifySignature,
};
