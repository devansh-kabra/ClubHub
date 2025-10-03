import Logo from "../Logo";
import ProfileMenu from "../ProfileMenu";
import ClubLinks from "./ClubLinks";
import StudentLinks from "./StudentLinks"

function DashboardNavbar({ user }) {

    return (
        <div id="navbar" className="bg-white fixed top-0 right-0 left-0 z-10 border-b-2 border-gray-950/5">
            <div id="navbar-content" className="flex h-12 lg:h-14 px-4 sm:px-6 md:px-16 items-center justify-between gap-8">
                <div id="left-content">
                    <Logo />
                </div>
                <div id="right-content" className="flex gap-4 sd:gap-6 lg:gap-8 items-center ">
                    {user === "club" && <ClubLinks />}
                    {user === "student" && <StudentLinks/>}
                    <ProfileMenu />
                </div>
            </div>
        </div>
    )
}

export default DashboardNavbar;