'use client'
import DashFooter from "@/app/components/dash-footer"
import DashHeader from "@/app/components/dash-header"
import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

export default function Budget() {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [wantsBudget, setWantsBudget] = useState(0);
  const [needsBudget, setNeedsBudget] = useState(0);
  const [othersBudget, setOthersBudget] = useState(0);

  const handleBudgetSubmit = () => {
    if (!selectedMonth || !wantsBudget || !needsBudget) {
      console.log("Please fill in all fields");
      return;
    }

    const userId = localStorage.getItem("userId");
    const db = firebase.firestore();

    const budgetData = {
      month: selectedMonth,
      wantsBudget: wantsBudget,
      needsBudget: needsBudget,
      othersBudget: othersBudget,
      userId: userId,
    };

    db.collection("budgets")
      .doc(`${selectedMonth}-${userId}`)
      .set(budgetData)
      .then(() => {
        console.log("Budget submitted successfully!");
        setSelectedMonth("");
        setWantsBudget(0);
        setNeedsBudget(0);
        setOthersBudget(0);
      })
      .catch((error) => {
        console.error("Error submitting budget:", error);
      });
  };

  const generateMonthOptions = () => {
    const today = new Date();
    const months = [];
    const optionsCount = 6;

    for (let i = 0; i < optionsCount; i++) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const month = monthDate.toLocaleString("default", { month: "long", year : "numeric"});
      months.push(month);
    }

    return months;
  };

  const monthOptions = generateMonthOptions();

  return (
    <div className="flex flex-col h-screen">
      <DashHeader className="self-start" title="Set Monthly Budget" />
      <div className="flex-grow p-8">
        <div className="mb-6">
          <label htmlFor="month" className="font-bold mb-1">
            Select Month:
          </label>
          <select
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select</option>
            {monthOptions.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <label htmlFor="wantsBudget" className="font-bold mb-1">
            Wants:
          </label>
          <input
            type="number"
            id="wantsBudget"
            value={wantsBudget}
            onChange={(e) => setWantsBudget(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="needsBudget" className="font-bold mb-1">
            Needs:
          </label>
          <input
            type="number"
            id="needsBudget"
            value={needsBudget}
            onChange={(e) => setNeedsBudget(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="othersBudget" className="font-bold mb-1">
            Others Budget:
          </label>
          <input
            type="number"
            id="othersBudget"
            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={othersBudget}
            onChange={(e) => setOthersBudget(parseInt(e.target.value))}
          />
        </div>
        <button
          onClick={handleBudgetSubmit}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit Budget
        </button>
      </div>
      <DashFooter className="self-end mt-auto" curFocus={"budget"} />
    </div>
  );
}