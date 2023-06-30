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

    const data = {
        labels: ['Wants', 'Needs', 'Other'],
        values: [12, 12, 22],
        colors: ['#ff0000', '#0000ff', '#ffff00'],
    };

    return (
        <div className="flex flex-col h-screen">
            <DashHeader className="self-start" title="Monthly Spendings" />
            <div className="flex-grow flex flex-wrap overflow-scroll w-full justify-center">
                <h2 className="relative pl-3 py-2 font-bold self-start bg-gray-300 w-full">{currentYear}</h2>
                {currentYearMonths.map((month) => (
                    <Month
                    key={month.number}
                    month={month.name}
                    year={month.year}
                    data={data}
                    monthNumber={month.number}
                  />
                ))}
            </div>
            {lastYearMonths.length > 0 && (
            <div className="flex-grow flex flex-wrap overflow-scroll w-full justify-center">
                <h2 className="relative pl-3 py-2 font-bold self-start bg-gray-300 w-full">{currentYear - 1}</h2>
                {lastYearMonths.map((month) => (
                <Month
                    key={month.number}
                    month={month.name}
                    year={month.year}
                    data={data}
                    monthNumber={month.number}
                />
                ))}
            </div>
            )}
            <DashFooter className="self-end mt-auto" curFocus={"calendar"} />
        </div>
    )
}

const Month = ({ month, data, monthNumber, year}) => {

    const userId = localStorage.getItem("userId");
    const [transactions, setTransactions] = useState([]);

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
                setTransactions(data);
            })
            .catch((error) => {
                console.error('Error fetching transactions:', error);
            });
        }; 
        getTransactions();
    }, [userId]);

    return (
        <div className="w-1/6 mx-6 my-5 flex flex-col items-center cursor-pointer">
            <Link
                href={{
                pathname: '/dashboard/monthly/monthDetails',
                query: {
                    month: month,
                    monthNumber: monthNumber,
                    year: year,
                }
                }}
            >
                {month}
            </Link>
            <PieChart data={data} className=""/>
        </div>
    )
}   

