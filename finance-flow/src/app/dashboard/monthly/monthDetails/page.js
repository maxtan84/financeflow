'use client'
import DashFooter from "@/app/components/dash-footer"
import DashHeader from "@/app/components/dash-header"
import { useState } from "react"
import firebase from "firebase/compat/app"
import 'firebase/compat/firestore'
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import BarGraph from "@/app/components/BarGraph"

export default function MonthlyDetails({ searchParams }) {
  const userId = localStorage.getItem("userId");
  const [transactions, setTransactions] = useState([]);
  const [shopping, setShopping] = useState(0);
  const [diningOut, setDiningOut] = useState(0);
  const [travelAndEntertainment, setTravelAndEntertainment] = useState(0);
  const [home, setHome] = useState(0);
  const [groceries, setGroceries] = useState(0);
  const [transportation, setTransportation] = useState(0);
  const [healthAndEducation, setHealthAndEducation] = useState(0);
  const [utilities, setUtilities] = useState(0);
  const [other, setOther] = useState(0);

  const month = searchParams.month;
  const monthNumber = searchParams.monthNumber;
  const year = searchParams.year;

  useEffect(() => {
    if (month) {
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

            const shop = data.filter((transaction) => transaction.category === 'Shopping');
            const shoppingTotal = shop.reduce((total, transaction) => total + parseInt(transaction.amount), 0);
            setShopping(shoppingTotal);
            const dining = data.filter((transaction) => transaction.category === 'Dining Out');
            const diningTotal = dining.reduce((total, transaction) => total + parseInt(transaction.amount), 0);
            setDiningOut(diningTotal);
            const travel = data.filter((transaction) => transaction.category === 'Travel and Entertainment');
            const travelTotal = travel.reduce((total, transaction) => total + parseInt(transaction.amount), 0);
            setTravelAndEntertainment(travelTotal);
            const house = data.filter((transaction) => transaction.category === 'Home');
            const homeTotal = house.reduce((total, transaction) => total + parseInt(transaction.amount), 0);
            setHome(homeTotal);
            const grocery = data.filter((transaction) => transaction.category === 'Groceries');
            const groceryTotal = grocery.reduce((total, transaction) => total + parseInt(transaction.amount), 0);
            setGroceries(groceryTotal);
            const transport = data.filter((transaction) => transaction.category === 'Transportation');
            const transportTotal = transport.reduce((total, transaction) => total + parseInt(transaction.amount), 0);
            setTransportation(transportTotal);
            const health = data.filter((transaction) => transaction.category === 'Health and Education');
            const healthTotal = health.reduce((total, transaction) => total + parseInt(transaction.amount), 0);
            setHealthAndEducation(healthTotal);
            const utility = data.filter((transaction) => transaction.category === 'Utilities');
            const utilityTotal = utility.reduce((total, transaction) => total + parseInt(transaction.amount), 0);
            setUtilities(utilityTotal);
            const other = data.filter((transaction) => transaction.category === 'Other');
            const otherTotal = other.reduce((total, transaction) => total + parseInt(transaction.amount), 0);
            setOther(otherTotal);
            setTransactions(data);
          })
          .catch((error) => {
            console.error('Error fetching transactions:', error);
          });
      };

      getTransactions();
    }
  }, [userId, month]);

  const label = 'Spending in ' + month;

  const data = {
    labels: ['Shopping', 'Dining Out', 'Travel and Entertainment', 'Home', 'Groceries', 'Transportation', 'Health and Education' ,'Other'],
    datasets: [
      {
        label: label,
        data: [shopping, diningOut, travelAndEntertainment, home, groceries, transportation, healthAndEducation, other],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex flex-col h-screen">
      <DashHeader className="self-start" title={`Analysis for ${month}`} />
      <div className="flex-grow overflow-scroll">
        <div className="flex justify-center">
          <BarGraph data={data} />
        </div>
        {transactions.length > 0 ? (
          <ul>
            {transactions.map((transaction) => (
              <li key={transaction.id}>
                <p>Name: {transaction.name}</p>
                <p>Amount: {transaction.amount}</p>
                <p>Category: {transaction.category}</p>
                <p>Date: {transaction.date}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No transactions found for {month}</p>
        )}
      </div>
      <DashFooter className="self-end mt-auto" curFocus={"calendar"} />
    </div>
  );
}
