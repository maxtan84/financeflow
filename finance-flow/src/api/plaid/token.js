// Import necessary dependencies
const express = require('express');
const plaid = require('plaid');

// Create an instance of the Express app
const app = express();

// Create an instance of the Plaid client
const plaidClient = new plaid.Client({
    clientID: '647d0b1b8635b6001be949c0',
    secret: '1dd0b478c6a2fa58a1dd396dd599fc',
    env: plaid.environments.sandbox, // Adjust the environment based on your needs
});

// Define the route for generating the Plaid Link token
app.get('/api/plaid/token', async (req, res) => {
  try {
    const tokenResponse = await plaidClient.createLinkToken({
      user: {
        client_user_id: 'unique-user-id', // Replace with your unique user identifier
      },
      client_name: 'Client',
      products: ['auth', 'transactions'],
      country_codes: ['US'],
      language: 'en',
    });

    const linkToken = tokenResponse.link_token;

    res.json({ linkToken }); // Send the response as JSON
  } catch (error) {
    console.error('Error generating Link token:', error);
    res.status(500).json({ error: 'Failed to generate Link token' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
