import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router";
import Home from "../pages/Home";
import {ProtectedRoute, ProtectRouteAll} from "./ProtectedRoute";
import DirectLogin from "./DirectLogin";
import Loading from "../components/Loading";

//general pages
const ErrorPage = lazy(() => import("../pages/ErrorPage"));

const StudentLogin = lazy(() => import("../pages/StudentPages/StudentLogin/StudentLogin.jsx"));
const ClubLogin = lazy(() => import("../pages/ClubPages/ClubLogin/ClubLogin.jsx"));
const ClubCreate = lazy(() => import("../pages/ClubPages/ClubLogin/ClubCreate.jsx"));

const Dashboard = lazy(() => import("../pages/Dashboard.jsx"));

//student pages
const AllClubs = lazy(() => import("../pages/StudentPages/AllClubs.jsx"));
const Bookmarks = lazy(() => import("../pages/StudentPages/Bookmarks/Bookmarks.jsx"));

//club pages
const MyEvents = lazy(() => import("../pages/ClubPages/MyEvents/MyEvents.jsx"));
const AddEvent = lazy(() => import("../pages/ClubPages/AddEvent/AddEvent.jsx"));

//event Page
const EventPage = lazy(() => import("../pages/EventPage.jsx"));
const ClubPage = lazy(() => import("../pages/ClubPage.jsx"));

function AppRoutes() {
    return (
        <Suspense fallback={
            <div className="h-screen w-screen flex justify-center items-center">
                <Loading />
            </div>
        }>
            <Routes>

                {/**login routes eased by cookies */}
                <Route path="/" element={
                    <DirectLogin>
                        <Home/>
                    </DirectLogin>
                } />

                <Route path="/student/login" element={
                    <DirectLogin>
                        <StudentLogin/>
                    </DirectLogin>
                } />

                <Route path="/club/login" element={
                    <DirectLogin>
                        <ClubLogin/>
                    </DirectLogin>
                } />

                <Route path="/club/create" element={
                    <DirectLogin>
                        <ClubCreate />
                    </DirectLogin>
                } />
                
                {/**student routes*/}

                <Route path="/student/dashboard" element={
                    <ProtectedRoute allow={"student"} >
                        <Dashboard user="student"/>
                    </ProtectedRoute>
                } />

                <Route path="/student/all-clubs" element={
                    <ProtectedRoute allow={"student"} >
                        <AllClubs/>
                    </ProtectedRoute>
                } />
        
                <Route path="/student/bookmarks" element={
                    <ProtectedRoute allow={"student"} >
                        <Bookmarks/>
                    </ProtectedRoute>
                } />

                {/**common routes */}
                <Route path="/:club_slug/events/:event_slug" element={
                    <ProtectRouteAll >
                        <EventPage/>
                    </ProtectRouteAll>
                } />

                <Route path="/:club_slug/" element={
                    <ProtectRouteAll >
                        <ClubPage/>
                    </ProtectRouteAll>
                } />

                {/* club routes */}
                <Route path="/club/dashboard" element={
                    <ProtectedRoute allow={"club"} >
                        <Dashboard user="club"/>
                    </ProtectedRoute>
                } />

                <Route path="/club/my-events" element={
                    <ProtectedRoute allow={"club"} >
                        <MyEvents/>
                    </ProtectedRoute>
                } />

                <Route path="/club/add-event" element={
                    <ProtectedRoute allow={"club"} >
                        <AddEvent/>
                    </ProtectedRoute>
                } />

                <Route path="/club/:event_slug/edit" element={
                    <ProtectedRoute allow={'club'}>
                        <AddEvent/>
                    </ProtectedRoute>
                } />

                <Route path="*" element={<ErrorPage errorCode="404" comment="Page Not Found"/>} />
            </Routes>
        </Suspense>
        
    )
    
}

export default AppRoutes;