'use client'
import DashFooter from "../components/dash-footer";
import DashHeader from "../components/dash-header";
import FadeInView from "../components/FadeInView";
import PieChart from "@/app/components/PieChart"
import LineGraph from "../components/LineGraph";
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
  const [monthData, setMonthData] = useState([]);
  const [mainDash, setMainDash] = useState(true);
  
  const numMonths = 12;

  const getMonths = () => {
    const months = [];
  
    for (let i = 0; i < 12; i++) {
        let monthNumber = month - i;
        let year = currentYear;
        
        if (monthNumber <= 0) {
            monthNumber += 12;
            year--;
        }
        
        const monthDate = new Date(year, monthNumber - 1, 1);
        const curMonth = monthDate.toLocaleString("default", { month: "long" });
    
        months.push({ name: curMonth, number: monthNumber, year: year});
    }
    return months;
  };

  const months = getMonths();

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

    const getMonthlyTransactions = async (transactionMonth, transactionYear) => {
      const db = firebase.firestore();
      const startDate = `${transactionYear}-${transactionMonth.toString().padStart(2, '0')}-01`;
      const endDate = `${transactionYear}-${transactionMonth.toString().padStart(2, '0')}-31`;
    
      const querySnapshot = await db
        .collection('transactions')
        .where('userId', '==', userId)
        .where('date', '>=', startDate)
        .where('date', '<=', endDate)
        .get();
    
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      let total = 0;
      data.forEach((transaction) => {
        total += parseInt(transaction.amount);
      });
      return total;
    };
  
    const fetchData = async () => {
      try {
        const promises = months.map(async (month) => {
          const total = await getMonthlyTransactions(month.number, month.year);
          return total;
        });
    
        Promise.all(promises).then((resolvedMonthData) => {
          setMonthData(resolvedMonthData.reverse());
        });
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchData();
    getTransactions();

  }, [userId]);

  const averageSpending = Math.round(totalSpending/numMonths) + (Math.round(100*(totalSpending/numMonths))%100)/100;
  const fill = monthlyWants === 0 && monthlyNeeds === 0 && monthlyOthers === 0 ? 1 : 0;
  const pieData = {
    labels: ['Wants', 'Needs', 'Other', 'No expenses this month!'],
    values: [monthlyWants, monthlyNeeds, monthlyOthers, fill],
    colors: ['#FF6384', '#36A2EB', '#FFCE56', '#808080'],
  };
  

  const lineLabels = [];
  for (let i = 11; i >= 0; i--) {
    const labelDate = new Date();
    labelDate.setMonth(labelDate.getMonth() - i);
    const labelMonth = labelDate.toLocaleString('default', { month: 'short' });
    lineLabels.push(labelMonth + ' ' + labelDate.getFullYear());
  }

  const lineData = {
    labels: lineLabels,
    datasets: [
      {
        label: 'Average Spending',
        data: monthData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const switchDash = () => {
    setMainDash(!mainDash);
  };

  return (
    <FadeInView>
      <div className="flex flex-col h-screen">
        <DashHeader className="self-start" title="DashBoard" />
        { mainDash && 
          <button className="self-end m-2 p-2 bg-green-700 rounded text-white text-sm cursor-pointer" onClick={switchDash}>
                View annual spending trends
          </button>
        }
        { !mainDash &&
          <button className="self-end m-2 p-2 bg-green-700 rounded text-white text-sm cursor-pointer" onClick={switchDash}>
            Back to main
          </button>
        }
        
        {!mainDash && 
          <div className="flex-grow flex flex-col justify-center items-center text-center">
            {/* add some text here */}
            <LineGraph data={lineData} />
          </div> 
        }
        {mainDash && 
          <div className="flex-grow flex flex-col justify-center items-center text-center">
            <h1 className="text-2xl font-semibold">Welcome Back!</h1>
            {monthTotal > averageSpending ? <h2 className="m-1">You are spending <i>more</i> than average this month. </h2> : <h2 className="m-1">You are spending <i>less</i> than average this month! </h2>}
            <div> 
              <PieChart 
                data={pieData}
              />
            </div>
            <h3 className="my-2">Total Spending for the month of {curMonth}: <strong>${monthTotal}</strong></h3> 
          </div> 
        }
        <DashFooter className="self-end mt-auto" curFocus={"dash"}/>
      </div>
    </FadeInView>
  );
}