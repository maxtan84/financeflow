export default function DashFooter({curFocus}) {
    return (
        <div className="flex bg-green-300">
            <DashIcon icon="./images/dashImg/enter.png" />
            <DashIcon icon="./images/dashImg/calendar.png" />
            <DashIcon icon="./images/dashImg/dollar-symbol.png" />
            <DashIcon icon="./images/dashImg/budget.png" />
            <DashIcon icon="./images/dashImg/user.png" />
        </div>
    )
}

const DashIcon = ({icon, text, curFocus}) => {
    return (
        <div className="m-4">
            <img src={icon} alt={text} className=" "/>
        </div>
    )

}
{/* <a href="https://www.flaticon.com/free-icons/enter" title="enter icons">Enter icons created by joalfa - Flaticon</a> */}