// Use dotenv to load environment variables
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Import the Express app
const app = require('./app');
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API listening on :${PORT}`));