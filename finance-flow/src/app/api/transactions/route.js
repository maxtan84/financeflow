import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { NextResponse } from 'next/server'
import axios from 'axios';

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
        const access_token = data.access_token;
        const plaidRequest = {
            access_token: access_token,
            count: 250,
        };
        const plaidResponse = await plaidClient.transactionsSync(plaidRequest);
        const plaidData = plaidResponse.data;
        console.log('Plaid data:', plaidData);
        return new Response(JSON.stringify({plaidData: plaidData}), {
            status: 200,
            headers: {
              "Content-Type": "application/json", 
            },
          });
    } catch (error) {
        console.error('Error fetching Plaid auth data:', error);
        return new Response('INTERNAL ERROR', {
            status: 500,
        });
    }   
}
