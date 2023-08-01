import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import axios from 'axios';

axios.defaults.baseURL = 'https://sandbox.plaid.com';

export async function POST(req) {
    const configuration = new Configuration({
      basePath: PlaidEnvironments.sandbox, // Replace with your desired environment (sandbox/development/production)
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
          'PLAID-SECRET': process.env.PLAID_SECRET,
        },
      },
    });
  
    const plaidClient = new PlaidApi(configuration);

    try {
        const data = await req.json();
        const publicToken = data.public_token;
        const plaidResponse = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken,
        });
        const accessToken = plaidResponse.data.access_token;
        // make sure to store this with appropriate user or pass into json for frontend to store
        return new Response(JSON.stringify({accessToken: accessToken}), {
          status: 200,
          headers: {
            "Content-Type": "application/json", 
          },
        });
    } catch (error) {
        console.error('Error exchanging public token:', error);
        return new Response('FAILED', {
            status: 500,
        });
    }
}