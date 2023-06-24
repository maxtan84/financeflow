'use client'
import DashFooter from "@/app/components/dash-footer"
import DashHeader from "@/app/components/dash-header"
import PieChart from "@/app/components/PieChart"
import { useState } from "react"
import firebase from "firebase/compat/app"
import 'firebase/compat/firestore'
import { useEffect } from "react"

export default function Monthly() {

    const data = {
        labels: ['Red', 'Blue', 'Yellow'],
        values: [12, 19, 8],
        colors: ['#ff0000', '#0000ff', '#ffff00'],
    };

    return (
        <div className="flex flex-col h-screen">
            <DashHeader className="self-start" title="Monthly Spendings" />
            <div className="flex-grow flex">
                <Month month="June" data={data} monthNumber="6" className=""/>
                <Month month="May" data={data} monthNumber="5" className=""/>
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
        <div className="h-[10%] m-8">
            <h1>{month}</h1>
            <PieChart data={data} />
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