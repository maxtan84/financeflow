'use client'
import DashFooter from "../components/dash-footer";
import DashHeader from "../components/dash-header";
import FadeInView from "../components/FadeInView";
import PieChart from "@/app/components/PieChart"
import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import 'firebase/compat/firestore';

export default function Dashboard() {

  const today = new Date();
  const currentYear = today.getFullYear();
  const lastYear = currentYear - 1;
  const month = today.getMonth() + 1;
  const curMonth = today.toLocaleString("default", { month: "long" });
  const userId = localStorage.getItem('userId');
  const [totalSpending, setTotalSpending] = useState(0);
  const [totalWants, setTotalWants] = useState(0);
  const [totalNeeds, setTotalNeeds] = useState(0);
  const [totalOthers, setTotalOthers] = useState(0);
  const [monthTotal, setMonthTotal] = useState(0);
  const [monthlyWants, setMonthlyWants] = useState(0);
  const [monthlyNeeds, setMonthlyNeeds] = useState(0);
  const [monthlyOthers, setMonthlyOthers] = useState(0);
  
  const numMonths = 12;

  useEffect(() => {
    setTotalSpending(0);
    setTotalWants(0);
    setTotalNeeds(0);
    setTotalOthers(0);
    // Delete these 3 lines above after deployment
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
      let monthlyTotal = 0;
      let monthlyWantsTotal = 0;
      let monthlyNeedsTotal = 0;
      let monthlyOthersTotal = 0;

      data.forEach((transaction) => {
          if (transaction.category === 'Shopping' || transaction.category === 'Dining Out' || transaction.category === 'Travel and Entertainment') {
              wantsTotal += parseInt(transaction.amount);
              if(transaction.date >= monthStartDate && transaction.date <= endDate) {
                monthlyTotal += parseInt(transaction.amount);
                monthlyWantsTotal += parseInt(transaction.amount);
              }
          }
      });

      data.forEach((transaction) => {
          if (transaction.category === 'Home' || transaction.category === 'Groceries' || transaction.category === 'Transportation' || transaction.category === 'Utilities' || transaction.category === 'Health and Education') {
              needsTotal += parseInt(transaction.amount);
              if(transaction.date >= monthStartDate && transaction.date <= endDate) {
                monthlyTotal += parseInt(transaction.amount);
                monthlyNeedsTotal += parseInt(transaction.amount);
              }
          }
      });

      data.forEach((transaction) => {
          if (transaction.category === 'Other') {
              othersTotal += parseInt(transaction.amount);
              if(transaction.date >= monthStartDate && transaction.date <= endDate) {
                monthlyTotal += parseInt(transaction.amount);
                monthlyOthersTotal += parseInt(transaction.amount);
              }
          }
      });

      setTotalWants(wantsTotal);
      setTotalNeeds(needsTotal);
      setTotalOthers(othersTotal);
      setMonthTotal(monthlyTotal);
      setMonthlyWants(monthlyWantsTotal);
      setMonthlyNeeds(monthlyNeedsTotal);
      setMonthlyOthers(monthlyOthersTotal);
      setTotalSpending(wantsTotal + needsTotal + othersTotal);
    })
    .catch((error) => {
        console.error('Error fetching transactions:', error);
    });
    };
    getTransactions();
    
  }, [userId]);

  const averageSpending = Math.round(totalSpending/numMonths) + (Math.round(100*(totalSpending/numMonths))%100)/100;
  const fill = monthlyWants === 0 && monthlyNeeds === 0 && monthlyOthers === 0 ? 1 : 0;
  const data = {
    labels: ['Wants', 'Needs', 'Other', 'No expenses this month!'],
    values: [monthlyWants, monthlyNeeds, monthlyOthers, fill],
    colors: ['#FF6384', '#36A2EB', '#FFCE56', '#808080'],
  };

  return (
    <FadeInView>
      <div className="flex flex-col h-screen">
        <DashHeader className="self-start" title="DashBoard" />
        <div className="flex-grow flex flex-col justify-center items-center text-center">
          <h1 className="text-2xl font-semibold">Welcome Back!</h1>
          {monthTotal > averageSpending ? <h2 className="m-1">You are spending <i>more</i> than average this month. </h2> : <h2 className="m-1">You are spending <i>less</i> than average this month! </h2>}
          <div> 
            <PieChart 
              data={data}
            />
          </div>
          <h3 className="my-2">Total Spending for the month of {curMonth}: <strong>${monthTotal}</strong></h3> 
        </div> 
        <DashFooter className="self-end mt-auto" curFocus={"dash"}/>
      </div>
    </FadeInView>
  );
}