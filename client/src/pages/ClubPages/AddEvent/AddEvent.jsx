import Footer from "../../../components/Footer";
import Navbar from "../../../components/Navbar";
import LoginButton from "../../../components/LoginButton";
import Loading from "../../../components/Loading";
import { PopUp_noButton, PopUp } from "../../../components/Popup";
import useAddEvent from "./useAddEvent";
import { useParams } from "react-router";
import { useEffect, useState } from "react";


function AddEvent() {
    const {event_slug} = useParams();
    const {setEverything, name, about, date, venue, startTime, endTime, registration, registration_deadline, handleChange, getDate, getDate_Time, message, setMessage, isLoading, isSuccess, handleSubmit} = useAddEvent();
    const [invalidEdit, setInvalidEdit] = useState(false);

    useEffect(() => {
        async function setMode() {
            if (event_slug) {
                const message = await setEverything(event_slug);
                if (!message) {setInvalidEdit(true);}
            }
        }
        setMode();
    }, [event_slug]);

    if (invalidEdit) {return (
        <div className="mt-6 w-full flex justify-center">
            <p className="font-inter text-lg">Cannot edit an event which has already been happend!!</p>
        </div>
    )}
    
    return (
        <div id="page container" className="min-h-screen min-w-full pt-16 lg:pt-20 pb-7 xl:pb-10 relative flex flex-col justify-center items-center">
            <Navbar/>

            <div id="form-container" className="login-container-style flex flex-col h-fit gap-3.5">
                <form id='eventform' onSubmit={handleSubmit} className={`grid sm:grid-cols-[auto_1fr] sm:gap-4 items-center `}>
                    
                    <label htmlFor="name" className="text-labelInput-style">Event Name:</label>
                    <input id="name" type="text" name="name" required placeholder="Required (Cannot be Changed Later)" className={`text-input-style mb-2 sm:mb-0 ${(event_slug) ? 'pointer-events-none':null}`} 
                        value={name} onChange={handleChange}></input>

                    <label htmlFor="about" className="text-labelInput-style">About Event:</label>
                    <textarea id="about" name="about" required placeholder="Required" className="text-input-style mb-2 sm:mb-0" value={about} onChange={handleChange}></textarea>

                    <label htmlFor="date" className="text-labelInput-style">Date:</label>
                    <input id="date" type="date" name="date" required className="text-input-style mb-2 sm:mb-0" min={getDate}  value={date} onChange={handleChange}></input>

                    <label htmlFor="venue" className="text-labelInput-style">Venue:</label>
                    <input id="venue" type="text" name="venue" className="text-input-style mb-2 sm:mb-0" value={venue} onChange={handleChange}></input>

                    <label htmlFor="start-time" className="text-labelInput-style">Start Time:</label>
                    <input id="start-time" type="time" name="start-time" className="text-input-style mb-2 sm:mb-0" value={startTime} onChange={handleChange}></input>

                    <label htmlFor="end-time" className="text-labelInput-style">End Time:</label>
                    <input id="end-time" type="time" name="end-time" className="text-input-style mb-2 sm:mb-0" value={endTime} onChange={handleChange}></input>

                    <label htmlFor="registration" className="text-labelInput-style">Registration Link (if any):</label>
                    <input id="registration" type="url" name="registration" placeholder="Only of form https://" className="text-input-style mb-2 sm:mb-0" value={registration} onChange={handleChange}></input>

                    {registration !== "" &&
                        <>
                            <label htmlFor="registration-deadline" className="text-labelInput-style">Registration Deadline:</label>
                            <input id="registration-deadline" type="datetime-local" name="registration-deadline" min={getDate_Time} value={registration_deadline} onChange={handleChange}  className="text-input-style mb-2 sm:mb-0" ></input>
                        </>
                    }

                </form>

                <div className={`flex flex-col justify-center items-center gap-2 mt-2 w-full `}>
                    <LoginButton content="Submit" onClick={() => document.getElementById("eventform").requestSubmit()}/>
                </div>

                {isLoading && 
                    <div className='flex justify-center items-center z-10 bg-white/50 fixed inset-0'>
                        <Loading/>
                    </div>
                }

                {message && !isSuccess && 
                    <div className="fixed inset-0 z-5 bg-white/50">
                        <PopUp content={"OK"} message={message} onClick={() => {setMessage(null);}}/>
                    </div>
                }
                {message && isSuccess && 
                    <div className="fixed inset-0 z-5 bg-white/50">
                        <PopUp_noButton message={message}/>
                    </div>
                }
            </div>
            
            <Footer/>
        </div>
    )
}

export default AddEvent;