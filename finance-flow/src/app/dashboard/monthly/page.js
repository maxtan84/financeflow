import DashFooter from "@/app/components/dash-footer"
import DashHeader from "@/app/components/dash-header"
import PieChart from "@/app/components/PieChart"

export default function Monthly() {

    const data = {
        labels: ['Red', 'Blue', 'Yellow'],
        values: [12, 19, 8],
        colors: ['#ff0000', '#0000ff', '#ffff00'],
    };

    return (
        <div className="flex flex-col h-screen">
            <DashHeader className="self-start" title="Monthly Spendings" />
            <div className="flex-grow">
                <Month month="January" data={data} className=""/>
                <Month month="Febuary" data={data} className=""/>
            </div>
            <DashFooter className="self-end mt-auto" curFocus={"calendar"} />
        </div>
    )
}

const Month = ({ month, data }) => {
    return (
        <div className="h-[10%] m-8">
            <h1>{month}</h1>
            <PieChart data={data} />
        </div>
    )
}   