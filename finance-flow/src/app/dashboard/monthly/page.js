import DashFooter from "@/app/components/dash-footer"
import DashHeader from "@/app/components/dash-header"

export default function Monthly() {
    return (
        <div className="flex flex-col h-screen">
            <DashHeader className="self-start" title="Monthly Spendings" />
            <div className="flex-grow"></div> {/* content */}
            <DashFooter className="self-end mt-auto" />
        </div>
    )
}