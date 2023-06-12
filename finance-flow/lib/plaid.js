import plaid from 'plaid';

export const plaidClient = new plaid.Client({
  clientID: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SECRET,
  publicKey: process.env.PLAID_PUBLIC_KEY,
  env: plaid.environments[process.env.PLAID_ENV],
});