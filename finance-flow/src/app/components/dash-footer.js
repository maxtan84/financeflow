import Link from 'next/link';

export default function DashFooter({ curFocus }) {
    return (
        <div className="flex bg-green-300">
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
    const borderStyle = isActive ? 'border-t border-black' : '';
  
    return (
      <div className={`m-4 py-2 ${borderStyle}`}>
        <Link href={link}>
            <img src={icon} alt={text} className="cursor-pointer" />
        </Link>
      </div>
    );
};