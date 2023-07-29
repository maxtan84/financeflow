import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { NextResponse } from 'next/server'
import axios from 'axios';

axios.defaults.baseURL = 'https://sandbox.plaid.com'; // Use the appropriate Plaid environment

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
    const plaidRequest = {
      user: {
        client_user_id: 'user',
      },
      client_name: 'Plaid Test App',
      products: ['transactions', 'auth'],
      language: 'en',
      redirect_uri: 'https://localhost:3000/', // Replace with your redirect URL
      country_codes: ['US', 'CA'], // Replace with your desired country codes
    };

    const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
    const linkToken = createTokenResponse.data.link_token;
    console.log('Link token:', linkToken);
    return new Response( JSON.stringify({"link_token": linkToken}), {
      status: 200,
      headers: {
        "Content-Type": "application/json", 
      },
    });
  } catch (error) {
    console.error('Error creating link token:', error);
    return new Response('INTERNAL ERROR', {
      status: 500,
    });
  }
}