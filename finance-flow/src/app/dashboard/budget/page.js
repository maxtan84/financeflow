import DashFooter from "@/app/components/dash-footer"
import DashHeader from "@/app/components/dash-header"

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen">
      <DashHeader className="self-start" title="Set Monthly Budget" />
      <div className="flex-grow"></div> 
      {/* budget:
            - Date
            - Set budget for wants and needs
                - Show current budget for the month if they have one
            - Send information to backend
            - Each user has one budget for each month, update budget when reseting */}
      <DashFooter className="self-end mt-auto" curFocus={"dash"}/>
    </div>
  );
}