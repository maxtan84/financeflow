import { Configuration, PlaidApi } from 'plaid';
import { NextResponse } from 'next/server'
import axios from 'axios';

axios.defaults.baseURL = 'https://sandbox.plaid.com';

export async function POST(req) {
    const configuration = new Configuration({
        basePath: PlaidEnvironments.sandbox, // Replace with your desired environment (sandbox/development/production)
        baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': '',
            'PLAID-SECRET': '',
        },
        },
    });

    const plaidClient = new PlaidApi(configuration);

    try {
        const access_token = req.body.access_token;
        const plaidRequest = {
            access_token: access_token,
        };
        const plaidResponse = await plaidClient.authGet(plaidRequest);
        const plaidData = plaidResponse.data;
        return new Response('WE GOOD', {
            status: 200,
            headers: {
              plaidData: plaidData,
            },
          });
    } catch (error) {
        console.error('Error fetching Plaid auth data:', error);
        return new Response('INTERNAL ERROR', {
            status: 500,
        });
    }   
}
