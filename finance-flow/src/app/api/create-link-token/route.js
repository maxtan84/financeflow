// import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
// import axios from 'axios';

// axios.defaults.baseURL = 'https://sandbox.plaid.com'; // Use the appropriate Plaid environment

export async function POST(req, res) {
  const body = req.body;
  console.log(body);
  return new Response('Hello there');
  // const configuration = new Configuration({
  //   basePath: PlaidEnvironments.sandbox, // Replace with your desired environment (sandbox/development/production)
  //   baseOptions: {
  //     headers: {
  //       'PLAID-CLIENT-ID': '',
  //       'PLAID-SECRET': '',
  //     },
  //   },
  // });

  // const plaidClient = new PlaidApi(configuration);

  // try {
  //   const plaidRequest = {
  //     user: {
  //       client_user_id: 'user',
  //     },
  //     client_name: 'Plaid Test App',
  //     products: ['auth'],
  //     language: 'en',
  //     redirect_uri: 'https://localhost:3000/', // Replace with your redirect URL
  //     country_codes: ['US','CA'], // Replace with your desired country codes
  //   };

  //   const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
  //   res.status(200).json({ link_token: createTokenResponse.data.link_token });
  // } catch (error) {
  //   console.error('Error creating link token:', error.message);
  //   res.status(500).json({ error: 'Failed to create link token' });
  // }
}