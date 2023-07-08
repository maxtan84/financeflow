'use client'
import DashFooter from "@/app/components/dash-footer"
import DashHeader from "@/app/components/dash-header"
import { useState } from "react";
import firebase from "firebase/compat/app";
import 'firebase/compat/firestore';

export default function Input() {
    const userId = localStorage.getItem('userId');
    const [transaction, setTransaction] = useState({
        name: "",
        amount: "",
        category: "",
        date: "",
    })

    const handleSubmit = (e) => {
        e.preventDefault();
      
        const db = firebase.firestore();
        db.collection('transactions')
          .add({ ...transaction, userId: userId })
          .then(() => {
            setTransaction({
              name: '',
              amount: '',
              category: '',
              date: ''
            });
            console.log('Transaction added to Firebase!');
          })
          .catch((error) => {
            console.error('Error adding transaction to Firebase:', error);
          });
      };
      
      return (
        <div className="flex flex-col h-screen">
          <DashHeader className="self-start" title="Input New Expense" />
          <div className="flex-grow m-4 text-lg flex justify-center overflow-scroll">
            <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 ">
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-bold mb-4">Name of Transaction:</label>
                <input
                  type="text"
                  id="name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={transaction.name}
                  onChange={(e) => setTransaction({ ...transaction, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="amount" className="block text-gray-700 font-bold mb-4">Amount Spent:</label>
                <input
                  type="number"
                  id="amount"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={transaction.amount}
                  onChange={(e) => setTransaction({ ...transaction, amount: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="category" className="block text-gray-700 font-bold mb-4">
                  Category:
                </label>
                <select
                  id="category"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={transaction.category}
                  onChange={(e) =>
                    setTransaction({ ...transaction, category: e.target.value })
                  }
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Dining Out">Dining Out</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Travel and Entertainment">Travel and Entertainment</option>
                  <option value="Home">Home</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Education and Health">Education and Health</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="date" className="block text-gray-700 font-bold mb-4">Date of Transaction:</label>
                <input
                  type="date"
                  id="date"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={transaction.date}
                  onChange={(e) => setTransaction({ ...transaction, date: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-10 float-right rounded focus:outline-none focus:shadow-outline">
                Submit
              </button>
            </form>
          </div>
          <DashFooter className="self-end mt-auto" curFocus="input" />
        </div>
      );
}