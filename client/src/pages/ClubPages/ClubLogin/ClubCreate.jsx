import { useNavigate } from "react-router";
import Footer from "../../../components/Footer";
import LoginButton from "../../../components/LoginButton";
import { PopUp } from "../../../components/Popup";
import useClubCreate from "./useClubCreate";
import Loading from "../../../components/Loading";
import Navbar from "../../../components/Navbar";

function ClubCreate() {
    const {name, about, genSec, genSecEmail, handleChange, handleSubmit, isLoading, isSuccess, message, setMessage} = useClubCreate();
    const navigate = useNavigate();

    return (
        <div id="page-container" className="min-h-screen min-w-full pt-16 lg:pt-20 pb-7 xl:pb-10 relative flex flex-col justify-center items-center">
            <Navbar/>
            <div id="club-create-container" className='login-container-style flex flex-col gap-3.5'>
                <form className={`grid sm:grid-cols-[auto_1fr] sm:gap-4 items-center`}>

                        <label htmlFor="name" className="text-labelInput-style">Club Name:</label>
                        <input id="name" type="text" name="name" className="text-input-style mb-2 sm:mb-0" value={name} onChange={handleChange}></input>
                        

                        <label htmlFor="about" className="text-labelInput-style">About:</label>
                        <textarea id="about" type="text" name="about" placeholder="Write about what the club is...." value={about} onChange={handleChange} className="text-input-style mb-2"></textarea>
                        

                        <label htmlFor="genSec" className="text-labelInput-style">General Secretary:</label>
                        <input id="genSec" type="text" name="genSec" className="text-input-style mb-2 sm:mb-0" onChange={handleChange} value={genSec}></input>
                        

                        <label htmlFor="gen-sec-email" className="text-labelInput-style">Gen Sec Student Email:</label>
                        <input id="gen-sec-email" type="email" name="genSecEmail" value={genSecEmail} onChange={handleChange} className="text-input-style mb-2 sm:mb-0"></input>
                </form>

                {isLoading && 
                    <div className='h-full w-full flex justify-center items-center z-10 bg-white/50 absolute right-1/2 translate-x-1/2'>
                        <Loading/>
                    </div>
                }

                {message && <PopUp message={message} content={"OK"} onClick={() => {
                        if (isSuccess) {setTimeout(()=>null, 5000); navigate("/"); return;}
                        else {setMessage(null);}
                    }}/>
                }
                
                <div className={`flex flex-col justify-center items-center gap-2 mt-2 w-full`}>
                    <LoginButton content="Submit" onClick={handleSubmit}/>
                    <p className='font-inter text-xs text-gray-400 italic'>Already Have a Club Registered?
                        Click <span className='underline cursor-pointer -m-4 p-4' onClick={() => navigate("/club/login")}>here</span>
                    </p>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default ClubCreate;