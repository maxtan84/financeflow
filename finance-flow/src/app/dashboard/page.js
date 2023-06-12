import DashFooter from "../components/dash-footer";
import DashHeader from "../components/dash-header";

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen bg-slate-600">
      <DashHeader className="self-start" title="Main DashBoard" />
      <div className="flex-grow"></div> {/* content */}
      <DashFooter className="self-end mt-auto" />
    </div>
  );
}