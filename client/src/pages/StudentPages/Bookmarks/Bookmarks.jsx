import useBookmarks from "./useBookmarks";
import { BookmarkIcon } from "@heroicons/react/24/solid";
import Navbar from "../../../components/Navbar";
import Loading from "../../../components/Loading";
import { useNavigate } from "react-router";
import { useRef, useEffect } from "react";

function BookMarks() {

    const {data, isLoading, isError, bookmarkRemove} = useBookmarks();
    const firstUpcomingRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (firstUpcomingRef.current) {
            firstUpcomingRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [data]);

    if (isLoading) {return (
        <div className='min-h-screen min-w-screen flex justify-center items-center'>
            <Navbar/>
            <Loading/> 
        </div>
    );}
    else if (isError) {return (
        <div className='min-h-screen min-w-screen flex justify-center items-center'>
            <Navbar/>
            <p className='text-black'>Bookmarks Not Found</p> 
        </div>
    );}

    return (
        <div id="page-container" className="min-h-screen flex flex-col items-center w-full pt-14 lg:pt-16 relative">
            <Navbar />
            {bookmarkRemove.isLoading &&
                <div className="h-screen w-screen flex justify-center items-center z-10 bg-white/50 fixed ">
                    <Loading/>
                </div>
            }
            <div id="main-container" className="w-[90%] max-w-[640px] ">
                {data.map(function (event) {
                    return (
                        <div id="event-container" key={event.id} className="grid grid-cols-[9fr_1fr] inset-shadow-xs p-3 overflow-y-auto" ref={event.first_event_id ? firstUpcomingRef:null}>
                            <div id="content" className="text-left flex flex-col cursor-pointer" onClick={() => navigate(`/${event.club_slug}/events/${event.event_slug}`)}>
                                <h1 id="title" className="text-xl sm:text-2xl lg:text-3xl font-inter mb-1 sm:mb-1.5 lg:mb-2">{event.name}</h1>
                                <h2 id="date" className="font-inter text-xs sm:text-sm lg:text-base">Date: {event.date}</h2>
                                <h2 id="timings" className="font-inter text-xs sm:text-sm lg:text-base">Timings: {event.time}</h2>
                                <h2 id="venue" className="font-inter text-xs sm:text-sm lg:text-base">Venue: {event.venue}</h2>
                            </div>
                            <div id="options" className="flex flex-col gap-6">
                                <div id="edit" className={`svg-navbar-container ${event.upcoming ? null:'cursor-not-allowed!'}`} onClick={(event.upcoming) ? () => bookmarkRemove.removeBookmark(event.id):null}>
                                    <BookmarkIcon className={`svg-navbar-style ${event.upcoming ? null:'text-[#ccc]!'}`}/>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default BookMarks;