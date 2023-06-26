'use client'
import DashFooter from "@/app/components/dash-footer"
import DashHeader from "@/app/components/dash-header"
import { useState } from "react"
import firebase from "firebase/compat/app"
import 'firebase/compat/firestore'
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function MonthlyDetails({ searchParams }) {
  const userId = localStorage.getItem("userId");
  const [transactions, setTransactions] = useState([]);

  console.log(searchParams.month);
  console.log(userId);
  const month = searchParams.month;
  const monthNumber = searchParams.monthNumber;

  useEffect(() => {
    if (month) {
      const getTransactions = () => {
        const db = firebase.firestore();
        const startDate = `2023-${monthNumber.toString().padStart(2, '0')}-01`;
        const endDate = `2023-${monthNumber.toString().padStart(2, '0')}-31`;
        db.collection('transactions')
          .where('userId', '==', userId)
          .where('date', '>=', startDate)
          .where('date', '<=', endDate)
          .get()
          .then((querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setTransactions(data);
          })
          .catch((error) => {
            console.error('Error fetching transactions:', error);
          });
      };

      getTransactions();
    }
  }, [userId, month]);

  return (
    <div className="flex flex-col h-screen">
      <DashHeader className="self-start" title={`Transactions in ${month}`} />
      <div className="flex-grow">
        {transactions.length > 0 ? (
          <ul>
            {transactions.map((transaction) => (
              <li key={transaction.id}>
                <p>Name: {transaction.name}</p>
                <p>Amount: {transaction.amount}</p>
                <p>Date: {transaction.date}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No transactions found for {month}</p>
        )}
      </div>
      <DashFooter className="self-end mt-auto" curFocus={"dash"} />
    </div>
  );
}
