'use client'
import DashFooter from "../../components/dash-footer";
import DashHeader from "../../components/dash-header";
import FadeInView from "../../components/FadeInView";
import { useState, useEffect } from "react"
import firebase from "firebase/compat/app"
import 'firebase/compat/firestore'

export default function Transactions() {
    let userId = "test";
    if (typeof window !== "undefined") {
        userId = localStorage.getItem("userId");
    }
    const [transactions, setTransactions] = useState([]);
    const [months, setMonths] = useState([]);
    const [deleting, setDeleting] = useState(false);
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
            const sortedResults = results.map((result) => {
                const sortedTransactions = result.transactions.sort((a, b) => {
                  const dateA = new Date(a.date);
                  const dateB = new Date(b.date);
                  return dateB - dateA;
                });
                return { ...result, transactions: sortedTransactions };
            });
            setTransactions(sortedResults);
        };

        if (months.length > 0) {
            fetchTransactions();
        }
    }, [months, userId, deleting]);

    return (
        // transition slide items in from right
        <div className="flex flex-col h-screen">
            <DashHeader className="self-start" title="Past Transactions" />
            <div className="flex-grow overflow-scroll">
                {transactions.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full">
                        <p className="mb-2 text-lg font-bold">No transactions found</p>
                        <p className="text-gray-500">Try adding some transactions</p>
                    </div>
                )}

                {transactions.map((transactionData) => (
                    transactionData.transactions.length > 0 && <Transaction
                        key={`${transactionData.month.year}-${transactionData.month.number}`}
                        month={transactionData.month.name}
                        year={transactionData.month.year}
                        transactions={transactionData.transactions}
                        deleting={deleting}
                        setDeleting={setDeleting}
                    />
                ))}
            </div>
            <DashFooter className="self-end mt-auto" curFocus={"transactions"}/>
        </div>
    );
}

const Transaction = ({ month, year, transactions, deleting, setDeleting }) => {
    const handleDelete = async (transactionId) => {
        try {
          const db = firebase.firestore();
          await db.collection('transactions').doc(transactionId).delete();
          setDeleting(!deleting);
        } catch (error) {
          console.error('Error deleting transaction:', error);
        }
      };

    return (
        <div className="overflow-x-hidden">
            <h2 className="mb-1 text-lg font-bold bg-gray-300">{month} {year}</h2>
            {transactions.map((transaction) => (
                <div key={transaction.id} className="flex">
                    <p className="m-1 w-[40%]" >{transaction.name}</p>
                    <p className="m-1 w-[20%]" >${transaction.amount}</p>
                    <p className="m-1 w-[30%]" >{transaction.date}</p>
                    <button
                        className="m-1 bg-gray-500 hover:bg-red-700 text-white px-1 rounded"
                        onClick={() => handleDelete(transaction.id)}
                    >
                        X
                    </button>
                </div>
            ))}
        </div>
    );
}
