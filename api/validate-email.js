// Expose the existing Express application as a Vercel serverless function.
// The app owns POST /api/validate-email and is also used by the local server.
module.exports = require('../server');
