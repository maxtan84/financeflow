'use client'
import DashFooter from "@/app/components/dash-footer"
import DashHeader from "@/app/components/dash-header"
import PieChart from "@/app/components/PieChart"
import { useState } from "react"
import { useEffect } from "react"
import Link from "next/link"
import firebase from "firebase/compat/app"
import 'firebase/compat/firestore'


export default function Monthly() {

    const getMonths = () => {
        const today = new Date();
        const months = [];
        for (let i = 0; i < 12; i++) {
          const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
          const month = monthDate.toLocaleString("default", { month: "long" });
          const monthNumber = monthDate.getMonth() + 1;
          months.push({ name: month, number: monthNumber });
        }
        return months;
    };
    
    const months = getMonths();

    const data = {
        labels: ['Wants', 'Needs', 'Other'],
        values: [12, 12, 22],
        colors: ['#ff0000', '#0000ff', '#ffff00'],
    };

    return (
        <div className="flex flex-col h-screen">
            <DashHeader className="self-start" title="Monthly Spendings" />
            <div className="flex-grow flex flex-wrap overflow-scroll w-full">
                {months.map((month) => (
                    <Month
                    key={month.number}
                    month={month.name}
                    data={data}
                    monthNumber={month.number}
                  />
                ))}
            </div>
            <DashFooter className="self-end mt-auto" curFocus={"calendar"} />
        </div>
    )
}

const Month = ({ month, data, monthNumber}) => {

    const userId = localStorage.getItem("userId");
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
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
    }, [userId]);

    return (
        <div className="w-1/6 m-8 flex flex-col items-center cursor-pointer">
            <Link
                href={{
                pathname: '/dashboard/monthly/monthDetails',
                query: {
                    month: month,
                    monthNumber: monthNumber,
                }
                }}
            >
                {month}
            </Link>
            
            <PieChart data={data} className=""/>
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
    )
}   

