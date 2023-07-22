'use client '
import Link from 'next/link';

export default function DashFooter({ curFocus }) {
    return (
      <div className="flex bg-green-400 h-25 pb-2">
        <DashIcon icon="/images/dashImg/enter.png" text="input" link="/dashboard/input" curFocus={curFocus} />
        <DashIcon icon="/images/dashImg/calendar.png" text="calendar" link="/dashboard/monthly" curFocus={curFocus} />
        <DashIcon icon="/images/dashImg/dollar-symbol.png" text="dash" link="/dashboard" curFocus={curFocus} />
        <DashIcon icon="/images/dashImg/budget.png" text="budget" link="/dashboard/budget" curFocus={curFocus} /> 
        <DashIcon icon="/images/dashImg/transactions.png" text="transactions" link="/dashboard/transactions" curFocus={curFocus} />
      </div>
    );
  }
  
  const DashIcon = ({ icon, text, link, curFocus }) => {
    const isActive = curFocus === text;
    const borderStyle = isActive ? 'border-t-2 border-black' : '';
    
    return (
      <div className={`m-4 flex justify-center flex-grow basis-1/12`}>
        <Link href={link}>
          <img src={icon} alt={text} className={`cursor-pointer h-14 ${borderStyle} pt-2`} />
        </Link>
      </div>
    );
  };
