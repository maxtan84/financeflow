'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { auth } from '/firebase-config';
import { PlaidLink } from 'react-plaid-link';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
      console.log('Logged in successfully!');
      setLoggedIn(true);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handlePlaidSuccess = async (publicToken, metadata) => {
    try {
      console.log('Public Token:', publicToken);
      console.log('Metadata:', metadata);

      // You can call your backend endpoint here to exchange the public token for an access token
      // and handle the Plaid success event, similar to the previous examples

      // Redirect the user to the dashboard or a specific page
      router.push('/dashboard');
    } catch (error) {
      console.error('Plaid Link error:', error);
    }
  };

  const generatePlaidLinkToken = async () => {
    try {
      const response = await fetch('/src/api/plaid/token.js');
      if (!response.ok) {
        throw new Error('Failed to fetch Plaid Link token');
      }
  
      const data = await response.json();
      const linkToken = data.linkToken;
  
      return (
        <PlaidLink
          clientName="User"
          env="sandbox"
          token={linkToken}
          onSuccess={handlePlaidSuccess}
        >
          Connect with your bank
        </PlaidLink>
      );
    } catch (error) {
      return null;
    }
  };

  return (
    <div className="bg-cover h-screen flex items-center justify-center" style={{backgroundImage: `url('/images/login-bg.jpg')`}}>
      <div className="bg-white h-[90%] w-4/5 flex flex-col items-center rounded-lg">
        <div className="mt-20">
          <Image src="/images/piggy-bank.png" alt="Finance Flow Logo" width={75} height={75} />
        </div>
        <h1 className="text-2xl mt-10 w-2/3 text-center">Login to continue saving!</h1>
        <form className="mt-8 flex flex-col items-left w-3/4" onSubmit={handleLogin}>
          <h2>Email</h2>
          <input onChange={handleEmailChange} className="px-3 mt-3 w-full h-12 rounded-md border-2 border-gray-300 focus:outline-none focus:border-blue-500" type="text" placeholder="Email" />

          <h2 className="mt-5">Password</h2>
          <input onChange={handlePasswordChange} className="px-3 mt-3 w-full h-12 rounded-md border-2 border-gray-300 focus:outline-none focus:border-blue-500" type="password" placeholder="Password" />

          <a className="text-blue-500 mt-3 text-sm self-end" href="/register">Register</a>
          <button className="w-full h-10 rounded-md bg-gray-300 text-white mt-5 hover:bg-blue-500 ease-in-out duration-200" type="submit">Login</button>
        </form>
        <button className="w-3/4 h-10 rounded-md bg-gray-300 text-white mt-5 hover:bg-blue-500 ease-in-out duration-200">Sign in with Google</button>
        {loggedIn && generatePlaidLinkToken()}
      </div>
    </div>
  );
}
