'use client'
import DashFooter from "@/app/components/dash-footer"
import DashHeader from "@/app/components/dash-header"
import { useState, useEffect } from "react"
import firebase from "firebase/compat/app"
import 'firebase/compat/firestore'
import { useRouter } from "next/navigation"
import BarGraph from "@/app/components/BarGraph"

export default function MonthlyDetails({ searchParams }) {
  const userId = localStorage.getItem("userId");
  const [selectedCategory, setSelectedCategory] = useState(null);
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

  const categories = [
    'Shopping',
    'Dining Out',
    'Travel & Entertainment',
    'Home',
    'Groceries',
    'Transportation',
    'Health and Education',
    'Utilities',
    'Other',
  ];

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
    labels: ['Shopping', 'Dining Out', 'Travel & Entertainment', 'Home', 'Groceries', 'Transportation', 'Health and Education' ,'Other'],
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
        <BarGraph data={data} />
        {categories.map((category) => (

          <Button
            key={category}
            text={category}
            onClick={() => setSelectedCategory(category)}
            isSelected={selectedCategory === category}
          />
        ))}

        {selectedCategory && (
          <div className="m-2">
            <h3 className="text-lg font-bold tracking-wide">Transactions for {selectedCategory}</h3>
            <ul>
              {transactions
                .filter((transaction) => transaction.category === selectedCategory)
                .map((transaction) => (
                  <li key={transaction.id} className="flex gap-x-2 my-1 text-sm">
                    <p className="w-[35%]">{transaction.name}</p>
                    <p className="w-[20%]">{transaction.amount}</p>
                    <p className="w-[35%]">{transaction.date}</p>
                  </li>
                ))}
            </ul>
          </div>
        )}
        {!selectedCategory && (
          <p>No category selected</p>
          // put here if budget then show spending based on budget, if not then prompt user to set a budget
        )}
      </div>
      
      <DashFooter className="self-end mt-auto" curFocus={"calendar"} />
    </div>
  );
}

const Button = ({ text, onClick, isSelected }) => (
  <button
    className={`bg-green-500 hover:bg-green-700 text-white font-bold text-xs py-1 px-2 rounded m-2`}
    onClick={onClick}
    style={{ opacity: isSelected ? 1 : 0.5 }}
  >
    {text}
  </button>
);
