const express = require('express');
const app = express();
const plaidRoutes = require('./routes/plaid');

// Set up middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up routes
app.use('/plaid', plaidRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});