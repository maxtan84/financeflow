'use client'
import DashFooter from "@/app/components/dash-footer"
import DashHeader from "@/app/components/dash-header"
import PieChart from "@/app/components/PieChart"
import { useState } from "react"
import { useEffect } from "react"
import Link from "next/link"
import firebase from "firebase/compat/app"
import 'firebase/compat/firestore'
import FadeInView from "@/app/components/FadeInView"

export default function Monthly() {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    const getMonths = () => {
        const months = [];
      
        for (let i = 0; i < 12; i++) {
            let monthNumber = currentMonth - i;
            let year = currentYear;
            
            if (monthNumber <= 0) {
                monthNumber += 12;
                year--;
            }
            
            const monthDate = new Date(year, monthNumber - 1, 1);
            const month = monthDate.toLocaleString("default", { month: "long" });
        
            months.push({ name: month, number: monthNumber, year: year});
        }
      
        return months;
    };
    
    const months = getMonths();
    const currentYearMonths = months.filter(month => month.year === currentYear);
    const lastYearMonths = months.filter(month => month.year === currentYear - 1);

    return (
        <div className="flex flex-col h-screen">
            <DashHeader className="self-start" title="Monthly Spendings" />
            <div className="overflow-scroll">
              <FadeInView>  
                <div className="flex-grow flex flex-wrap w-full justify-center">
                    <h2 className="relative pl-3 py-2 font-bold self-start bg-gray-300 w-full h-auto">{currentYear}</h2>
                    {currentYearMonths.map((month) => (
                        <Month
                        key={month.number}
                        month={month.name}
                        year={month.year}
                        monthNumber={month.number}
                    />
                    ))}
                </div>
                {lastYearMonths.length > 0 && (
                <div className="flex-grow flex flex-wrap w-full justify-center">
                    <h2 className="relative pl-3 py-2 font-bold self-start bg-gray-300 w-full">{currentYear - 1}</h2>
                    {lastYearMonths.map((month) => (
                    <Month
                        key={month.number}
                        month={month.name}
                        year={month.year}
                        monthNumber={month.number}
                    />
                    ))}
                </div>
                )}
              </FadeInView>
            </div>
            <DashFooter className="self-end mt-auto" curFocus={"calendar"} />
        </div>
    )
}

const Month = ({ month, monthNumber, year }) => {
  const userId = localStorage.getItem('userId');
  const [transactions, setTransactions] = useState([]);
  const [wants, setWants] = useState(0);
  const [needs, setNeeds] = useState(0);
  const [other, setOther] = useState(0);

  useEffect(() => {
    const getTransactions = () => {
      const db = firebase.firestore();
      const startDate = `${year}-${monthNumber.toString().padStart(2, '0')}-01`;
      const endDate = `${year}-${monthNumber.toString().padStart(2, '0')}-31`;
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
              wantsTotal += parseInt(transaction.amount);
          }
      });

      data.forEach((transaction) => {
          if (transaction.category === 'Home' || transaction.category === 'Groceries' || transaction.category === 'Transportation' || transaction.category === 'Utilities' || transaction.category === 'Health and Education') {
              needsTotal += parseInt(transaction.amount);
          }
      });

      data.forEach((transaction) => {
          if (transaction.category === 'Other') {
              othersTotal += parseInt(transaction.amount);
          }
      });
        
      setTransactions(data);
      setWants(wantsTotal);
      setNeeds(needsTotal);
      setOther(othersTotal);
    })
    .catch((error) => {
        console.error('Error fetching transactions:', error);
    });
    };
    getTransactions();
  }, [userId]);

  let fill = 0;
  if (wants === 0 && needs === 0 && other === 0) {
    fill = 1;
  }
  const data = {
    labels: ['Wants', 'Needs', 'Other', 'No expenses this month!'],
    values: [wants, needs, other, fill],
    colors: ['#FF6384', '#36A2EB', '#FFCE56', '#808080'],
  };

  return (
    <div className="w-1/6 m-6 flex flex-col items-center cursor-pointer">
      <Link
        href={{
          pathname: '/dashboard/monthly/monthDetails',
          query: {
            month: month,
            monthNumber: monthNumber,
            year: year,
          },
        }}
      >
        {month}
      </Link>
      <PieChart data={data} className="" />
    </div>
  );
};

