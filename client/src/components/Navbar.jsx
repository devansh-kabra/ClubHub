import { useNavigate } from "react-router";
import Logo from "./Logo";
import ProfileMenu from "./ProfileMenu";
import { ArrowLeftIcon } from '@heroicons/react/24/solid'
import { useQueryClient } from "@tanstack/react-query";

function Navbar() {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const userInfo = queryClient.getQueryData(["user"]);
    const userType = userInfo.userType;

    function handleback() {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate(`/${userType}/dashboard`);
        }
    }

    return (
        <div id="navbar" className="bg-white fixed top-0 right-0 left-0 z-10 border-b-2 border-gray-950/5">
            <div id="navbar-content" className="flex h-12 lg:h-14 px-4 sm:px-6 md:px-16 items-center justify-between gap-8">
                <div id="left-content" className="svg-navbar-container" onClick={handleback}>
                    <ArrowLeftIcon className='svg-navbar-style' id="back-icon"/>
                </div>
                <div id="mid-content">
                    <Logo />
                </div>
                <div id="right-content" className="flex items-center ">
                    <ProfileMenu />
                </div>
            </div>
        </div>
        
    )
}

export default Navbar;