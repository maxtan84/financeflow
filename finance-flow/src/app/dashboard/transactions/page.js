'use client'
import DashFooter from "@/app/components/dash-footer"
import DashHeader from "@/app/components/dash-header"
import { useState, useEffect } from "react"
import firebase from "firebase/compat/app"
import 'firebase/compat/firestore'

export default function Transactions() {
    const userId = localStorage.getItem("userId");
    const [transactions, setTransactions] = useState([]);
    const [months, setMonths] = useState([]);
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    useEffect(() => {
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

        setMonths(getMonths());
    }, [currentMonth, currentYear]);

    useEffect(() => {
        const fetchTransactions = async () => {
            const db = firebase.firestore();
            const transactionPromises = months.map(async (month) => {
                const startDate = `${month.year}-${month.number.toString().padStart(2, '0')}-01`;
                const endDate = `${month.year}-${month.number.toString().padStart(2, '0')}-31`;
                const querySnapshot = await db.collection('transactions')
                    .where('userId', '==', userId)
                    .where('date', '>=', startDate)
                    .where('date', '<=', endDate)
                    .get();
                const data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                return { month, transactions: data };
            });
            const results = await Promise.all(transactionPromises);
            const sortedResults = results.sort((a, b) => {
                if (a.month.year === b.month.year) {
                    return b.month.number - a.month.number;
                }
                return b.month.year - a.month.year;
            });
            setTransactions(sortedResults);
        };

        if (months.length > 0) {
            fetchTransactions();
        }
    }, [months, userId]);

    return (
        <div className="flex flex-col h-screen">
            <DashHeader className="self-start" title="Past Transactions" />
            <div className="flex-grow">
                {transactions.map((transactionData) => (
                    transactionData.transactions.length > 0 && <Month
                        key={`${transactionData.month.year}-${transactionData.month.number}`}
                        month={transactionData.month.name}
                        year={transactionData.month.year}
                        transactions={transactionData.transactions}
                    />
                ))}
            </div>
            <DashFooter className="self-end mt-auto" curFocus={"transactions"}/>
        </div>
    );
}

const Month = ({ month, year, transactions }) => {
    return (
        <div>
            <h2 className="text-lg font-bold">{month} {year}</h2>
            {transactions.map((transaction) => (
                <div key={transaction.id}>
                    <p>Name: {transaction.name}</p>
                    <p>Amount: {transaction.amount}</p>
                    <p>Date: {transaction.date}</p>
                </div>
            ))}
        </div>
    );
}
