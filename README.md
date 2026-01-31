# insurance-zktls-backend — Express demo

This repository is a small Express backend demo implementing an insurance registration and claim flow that is designed to be integrated with PrimusLabs' zktls. The project is intentionally minimal and uses an in-memory store and a zktls adapter stub so you can prototype faster.

What you'll find
- `src/` — Express app and routes:
	- `src/routes/records.js` — POST `/health/records/:record_id` (create/return a health check record)
	- `src/routes/invoices.js` — POST `/health/invoices/:invoice_id` (create/return invoice)
	- `src/routes/templates.js` — POST `/templates` (create), GET `/templates/:template_id` (fetch)
	- `src/routes/claims.js` — POST `/claim` — claim flow (validate invoice/record/template, verify signature, return tx details)
- `src/lib/store.js` — lightweight in-memory store (replace this with a DB in production)
- `src/lib/zktlsAdapter.js` — adapter stub with TODOs where to wire real PrimusLabs zktls SDK
- `scripts/api-caller.js` — small CLI to call the demo endpoints
- `test/test-claim.js` — script that simulates a full flow (create record -> invoice -> template -> claim)

Prerequisites
- Node.js 18+ recommended (Node 18 includes a global `fetch`).
- npm or yarn

Quick start

1) Install dependencies

```bash
cd /Applications/finema/enauthn/clone/zktls/zktls-demo/insurance-zktls-backend
npm install
```

If `npm install` fails with errors related to ESM packages like `node-fetch`, ensure you're using Node 18+ or replace `node-fetch` with `undici` (instructions in Troubleshooting).

2) Start the server

```bash
npm run start
# or for development with auto-reload if you have nodemon installed
npm run dev
```

3) Run the test flow (in another terminal)

```bash
npm test
```

4) Use the API caller (examples)

```bash
# create a record
npm run api -- create-record rec123 '{"hash":"pdf_h1","doc_id":"docA","hospital_name":"Demo Hospital"}'

# create invoice
npm run api -- create-invoice inv123 '{"record_id":"rec123","transaction_id":"bank_tx_1","amount":150,"receiver_address":"0xReceiver"}'

# create a template
npm run api -- create-template '{"name":"ClaimTemplate v1","fields":["record_id","invoice_id","amount"]}'

# claim
npm run api -- claim '{"user_wallet":"0xUserWallet","template_id":"<paste template_id here>","invoice_id":"inv123"}'
```

API Reference (demo behavior)

- POST `/health/records/:record_id`
	- Creates (or returns existing) a health record. Body fields accepted: `hash`, `doc_id`, `hospital_name`, `dt`.
	- Response: record object with `record_id`, `checked: true`, `signature` (simulated by adapter stub).

- POST `/health/invoices/:invoice_id`
	- Create (or return existing) an invoice. Expected body: `record_id`, `transaction_id`, `amount`, `receiver_address`.
	- Response: invoice object with `invoice_id` and provided fields.

- POST `/templates`
	- Create a Template (using the zktls adapter stub). Body: template metadata (name, fields, etc.).
	- Response: stored template object with `template_id`.

- GET `/templates/:template_id`
	- Retrieve created template.

- POST `/claim`
	- Body: `{ user_wallet, template_id, invoice_id, currency? }`
	- Flow: validate template exists -> invoice exists -> record exists for invoice -> verify record signature via zktls adapter (stubbed to valid) -> return simulated payout transaction object `{ tx_id, amount, currency, receiver_address, status }`.

Integrating real PrimusLabs zktls
- Replace the functions in `src/lib/zktlsAdapter.js` with actual SDK calls. The stub currently exposes:
	- `createTemplate(manualData)`
	- `signRecordHash(recordHash, signerInfo)`
	- `verifySignature(recordHash, signature)`
- Load SDK credentials from environment variables (see `.env.example`). Use secure secret storage for production.

Troubleshooting

- npm install errors (ESM / node-fetch)
	- Symptoms: `npm i` fails with errors about node-fetch or ESM package requiring an import.
	- Cause: `node-fetch@3` is ESM-only and may cause issues in some Node/npm setups, or your Node version is older than 18.
	- Fix options:
		1. Use Node 18+ (recommended). Node 18 has a global fetch and works well with ESM packages.
		2. Replace `node-fetch` with `undici`:

			 ```bash
			 # remove node-fetch
			 npm uninstall node-fetch
			 npm install undici
			 ```

			 Then update `scripts/api-caller.js` to import from `undici` instead of `node-fetch` (or rely on global `fetch`). Example change inside the script:

			 ```js
			 const { fetch } = require('undici');
			 global.fetch = fetch;
			 ```

		3. Alternatively, if you must keep `node-fetch@2`, install that specific version which supports CommonJS:

			 ```bash
			 npm uninstall node-fetch
			 npm install node-fetch@2
			 ```

- Port conflicts
	- If port 4000 is in use, set `PORT` in your environment or `.env` before starting: `PORT=5000 npm start`.

Security & production notes
- The demo uses an in-memory store — data will be lost on restart. Use a database (Postgres/Mongo) in production.
- Add authentication (API keys or OAuth) for hospitals and users before accepting real data.
- Store zktls credentials securely and follow PrimusLabs best practices for signing and verification.

Deployment (quick suggestions)
- For a Vercel-like experience for backends, try Render or Railway. Both support Node apps with minimal setup.

Render quick steps
1. Create an account and connect your GitHub repository.
2. Create a new "Web Service" and point to this repo path: `insurance-zktls-backend`.
3. Set build command: `npm install && npm run build` (no build step required here, so leave blank) and start command: `npm run start`.
4. Add environment variables (ZKTLS API keys) in the Render dashboard.

Railway quick steps
1. Create a project and import repository.
2. Set the service to run `npm start` in the `insurance-zktls-backend` directory.
3. Add environment variables in Railway's UI.

Next steps you can ask me to do
- Run `npm install` here and capture the logs (I'll try to fix dependency issues automatically).
- Replace `node-fetch` with `undici` and update the script to work in all Node versions.
- Add a simple SQLite-backed store to persist data and add a few unit tests.

License
- MIT

Thank you — if you'd like I can now attempt `npm install` here, fix any dependency issues, and start the server and run the test flow for you. Pick "install & run" or "only install" or "replace node-fetch with undici" and I will proceed.
