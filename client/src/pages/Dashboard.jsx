import { lazy, Suspense } from "react";
import Footer from "../components/Footer"
import DashboardNavbar from "../components/DashboardNavbar/DashboardNavbar";
import Loading from "../components/Loading";

const EventCalendar = lazy(() => import("../components/EventCalendar/EventCalendar"));

function Dashboard({user}) {
    return (
        <div className="relative min-h-screen flex flex-col " id="page-container">
            <div>
                <DashboardNavbar user={user}/>
                <div id="spacer" className="h-14"></div>
            </div>
            <div className="flex-grow pb-5 sm:pb-7 xl:pb-10">
                <Suspense fallback={(<Loading/>)}>
                    <EventCalendar />
                </Suspense>
            </div>
            <Footer/>
        </div>
    )
}

export default Dashboard;