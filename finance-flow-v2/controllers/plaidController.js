const plaid = require('plaid');

// Initialize the Plaid client with your API keys
const plaidClient = new plaid.Client({
  clientID: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SECRET,
  env: process.env.PLAID_ENV,
});

// Controller action for initiating the Plaid Link flow
const initiateLinkFlow = (req, res) => {
  // Implement your logic to generate the Plaid Link token and send it to the client
  // Example code snippet to generate the token:
  const request = {
    user: { client_user_id: 'unique-user-id' },
    client_name: 'Your App Name',
    products: ['auth', 'transactions'],
    country_codes: ['US'],
    language: 'en',
  };

  plaidClient.createLinkToken(request, (error, result) => {
    if (error) {
      console.error('Error generating Link token:', error);
      return res.status(500).json({ error: 'Failed to generate Link token' });
    }
    const linkToken = result.link_token;
    return res.json({ linkToken });
  });
};

// Controller action for handling the Plaid Link callback
const handleLinkCallback = (req, res) => {
  const publicToken = req.body.public_token;

  // Exchange the public token for an access token and other required information
  plaidClient.exchangePublicToken(publicToken, (error, result) => {
    if (error) {
      console.error('Error exchanging public token:', error);
      return res.status(500).json({ error: 'Failed to exchange public token' });
    }
    const accessToken = result.access_token;
    // Process the data as needed and send a response
    return res.json({ accessToken });
  });
};

module.exports = {
  initiateLinkFlow,
  handleLinkCallback,
};