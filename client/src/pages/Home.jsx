import { useNavigate } from "react-router"
import Footer from "../components/Footer"
import LoginButton from "../components/LoginButton"

function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-dvh  flex flex-col items-center" id="page-container">
            <div className="m-auto flex flex-col items-center gap-6">
                <div id="title" className="flex flex-col items-center">
                    <h1 className="flex flex-col items-center font-poppins font-bold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl">NITW
                        <span className="text-7xl sm:text-8xl lg:text-9xl xl:text-[9rem]">ClubHub</span>
                    </h1>
                    <p className="italic font-inter text-base xl:text-xl">One stop for all club events!</p>
                </div>
                <div id="login" className="flex flex-col items-center gap-3 sm:gap-0 sm:flex-row sm:justify-around w-[75%] xl:w-[65%]">
                    <LoginButton content="Student Login" onClick={() => navigate("/student/login")}/>
                    <LoginButton content="Club Login" onClick={() => navigate("/club/login")}/>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Home;