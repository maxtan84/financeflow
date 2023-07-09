'use client'
import DashFooter from "../components/dash-footer";
import DashHeader from "../components/dash-header";
import FadeInView from "../components/FadeInView";
import PieChart from "../components/PieChart";
import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import 'firebase/compat/firestore';

export default function Dashboard() {

  const today = new Date();
  const currentYear = today.getFullYear();
  const lastYear = currentYear - 1;
  const month = today.getMonth() + 1;
  const userId = localStorage.getItem('userId');
  const [totalSpending, setTotalSpending] = useState(0);
  const [totalWants, setTotalWants] = useState(0);
  const [totalNeeds, setTotalNeeds] = useState(0);
  const [totalOthers, setTotalOthers] = useState(0);
  const [numMonths, setNumMonths] = useState(0);

  useEffect(() => {
    const getTransactions = () => {
      const db = firebase.firestore();
      const startDate = `${lastYear}-${month.toString().padStart(2, '0')}-31`;
      const endDate = `${currentYear}-${month.toString().padStart(2, '0')}-31`;
      const monthStartDate = `${currentYear}-${month.toString().padStart(2, '0')}-01`;
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

      let wantsTotal = 0;
      let needsTotal = 0;
      let othersTotal = 0;

      data.forEach((transaction) => {
          if (transaction.category === 'Shopping' || transaction.category === 'Dining Out' || transaction.category === 'Travel and Entertainment') {
            console.log(transaction.amount);
              wantsTotal += parseInt(transaction.amount);
          }
      });

      data.forEach((transaction) => {
          if (transaction.category === 'Home' || transaction.category === 'Groceries' || transaction.category === 'Transportation' || transaction.category === 'Utilities' || transaction.category === 'Education' || transaction.category === 'Health') {
              needsTotal += parseInt(transaction.amount);
          }
      });

      data.forEach((transaction) => {
          if (transaction.category === 'Other') {
              othersTotal += parseInt(transaction.amount);
          }
      });

      setTotalWants((prevTotal) => prevTotal + wantsTotal);
      setTotalNeeds((prevTotal) => prevTotal + needsTotal);
      setTotalOthers((prevTotal) => prevTotal + othersTotal);
      setTotalSpending((prevTotal) => prevTotal + wantsTotal + needsTotal + othersTotal);
      
      setNumMonths((prevNum) => prevNum + 1);
    })
    .catch((error) => {
        console.error('Error fetching transactions:', error);
    });
    };
    getTransactions();
    
  }, [userId]);
  console.log(totalWants, totalNeeds, totalOthers, totalSpending)
  return (
    <FadeInView>
      <div className="flex flex-col h-screen">
        <DashHeader className="self-start" title="DashBoard" />
        <div className="flex-grow">
          <h1>Welcome Back!</h1>
          <h2>Your average spending per month this past year was: </h2>
          <h3>Total Spending for the month of {}: ${totalSpending}</h3>


        </div> 
        <DashFooter className="self-end mt-auto" curFocus={"dash"}/>
      </div>
    </FadeInView>
  );
}