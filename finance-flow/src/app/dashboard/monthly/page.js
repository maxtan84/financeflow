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
                <PieChart data={data} />
            </div>
            <DashFooter className="self-end mt-auto" />
        </div>
    )
}