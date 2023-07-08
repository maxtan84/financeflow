import DashFooter from "../components/dash-footer";
import DashHeader from "../components/dash-header";
import FadeInView from "../components/FadeInView";

export default function Dashboard() {
  return (
    <FadeInView>
      <div className="flex flex-col h-screen">
        <DashHeader className="self-start" title="DashBoard" />
        <div className="flex-grow"></div> {/* content */}
        <DashFooter className="self-end mt-auto" curFocus={"dash"}/>
      </div>
    </FadeInView>
  );
}