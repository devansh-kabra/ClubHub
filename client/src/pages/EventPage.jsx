import { useParams } from "react-router";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import { getEvent } from "../../util/common";
import { getTimeOfEvent } from "../../util/date_to_string";
import { toggleBookmark } from "../../util/common";

function getRegistrationDeadline(registration_deadline) {
    const deadline = new Date(registration_deadline);

    let month = `${deadline.getMonth()+1}`;
    if (month < 10) {month = `0${month}`;}

    let day = `${deadline.getDate()}`;
    if (day < 10) {day = `0${day}`;}

    let hour = `${deadline.getHours()}`;
    if (hour < 10) {hour = `0${hour}`;}

    let minutes = `${deadline.getMinutes()}`;
    if (minutes < 10) {minutes = `0${minutes}`;}


    return (`${day}/${month}/${deadline.getFullYear()} ${hour}:${minutes}`);
}

function EventPage() {
    const {club_slug, event_slug} = useParams();
    const queryClient = useQueryClient();
    const [bookmarked, setBookmarked] = useState(false);

    const {data: eventInfo, isLoading, isError} = useQuery({
        queryKey: ["event", club_slug, event_slug],
        queryFn: () => getEvent(club_slug, event_slug),
        staleTime: 1000 * 60 * 10,
    });

    const bookmarkMutation = useMutation({
        mutationFn: async ({id, newBookmark}) => toggleBookmark(id, newBookmark),
        onSuccess: async (data, {id, newBookmark}) => {
            setBookmarked(newBookmark);
            queryClient.setQueryData(["event", club_slug, event_slug], (oldData) => {
                if (!oldData) {return [];}
                const change = newBookmark ? 1:-1;
                return {
                    ...oldData,
                    bookmark: oldData.bookmark + change,
                    bookmarked: newBookmark,
                }
            });
            queryClient.invalidateQueries(["bookmarks"]);
        },
        onError: () => {alert("Unable to update bookmarks")}
    });
    
    useEffect(() => {
        if (eventInfo) {
            const newBookmark = eventInfo.bookmarked;
            if (bookmarked != newBookmark) {setBookmarked(newBookmark);}
        }
    }, [eventInfo, bookmarked]);

    const user = queryClient.getQueryData(["user"]);


    if (isLoading) {return (
        <div className='h-screen w-screen flex justify-center items-center'>
            <Navbar/>
            <Loading/> 
        </div>
    );}
    else if (isError) {return (
        <div className='h-screen w-screen flex justify-center items-center'>
            <Navbar/>
            <p className='text-black'>Event Not Found</p> 
        </div>
    );}

    return (
        <div id="page-container" className="min-h-full min-w-full ">
            <Navbar/>
            <div id="content" className="mt-20 w-full">
                <section id="content-part-1" className="py-8 px-16 w-full bg-[#1a1a1a]  flex items-center justify-center">
                    <div id="title" className="text-white text-center h-full flex flex-col justify-center items-center gap-2">
                            <h2 title="club name" className="font-poppins italic text-base sm:text-lg md:text-2xl font-light">{eventInfo.club} Presents</h2>  
                            <h1 title="name" className="font-poppins text-3xl sm:text-5xl md:text-7xl mb-2 sm:mb-4 font-semibold leading-normal">{eventInfo.name}</h1>
                            <h3 title="event info" className="font-poppins text-sm sm:text-lg md:text-2xl font-normal whitespace-normal">
                                {`${eventInfo.date.getDate()}/${eventInfo.date.getMonth()+1}/${eventInfo.date.getFullYear()}`}    •    {getTimeOfEvent(eventInfo.startTime, eventInfo.endTime)}    •    {eventInfo.venue}
                            </h3>
                            <div id="bookmark" className='w-full flex flex-col items-center justify-center pt-2 lg:pt-5'>
                                <button title="bookmark" className={`font-inter text-sm sm:text-base xl:text-lg py-0 px-0 sm:py-1 sm:px-3 min-h-8 sm:min-h-9 w-35 sm:w-40 xl:w-45 rounded-full  border-white border
                                    ${bookmarked ? `bg-white text-[#1a1a1a] ${(user.userType === "student" && eventInfo.upcoming) ? 'cursor-pointer lg:hover:bg-[#1a1a1a] lg:hover:border lg:hover:border-white lg:hover:text-white active:scale-95':'cursor-not-allowed'}`:
                                        `bg-[#1a1a1a] text-white ${(user.userType === "student" && eventInfo.upcoming) ? 'cursor-pointer lg:hover:bg-white lg:hover:border lg:hover:border-[#1a1a1a] lg:hover:text-[#1a1a1a] active:scale-95':'cursor-not-allowed'}`
                                    }`} 
                                    onClick={(user.userType === "student" && eventInfo.upcoming) ? () => bookmarkMutation.mutate({
                                        id: eventInfo.id,
                                        newBookmark: (!bookmarked)
                                    }):null}>
                                    Bookmarks: {eventInfo.bookmark}
                                </button>
                                {user.userType === "club" && <p className="italic font-inter text-[8px] md:text-[10px] font-normal mt-1.5 flex">
                                        <span className="flex flex-col justify-start">*</span>
                                        Clubs cannot bookmark
                                    </p>
                                }
                                {user.userType === "student" && !eventInfo.upcoming && <p className="italic font-inter text-[8px] md:text-[10px] font-normal mt-1.5 flex">
                                        <span className="flex flex-col justify-start">*</span>
                                        Past events cannot be bookmarked
                                    </p>
                                }
                                {user.userType === "student" && eventInfo.upcoming && <p className="italic font-inter text-[8px] md:text-[10px] font-normal mt-1.5 flex">
                                        <span className="flex flex-col justify-start">*</span>
                                        Click above to bookmark
                                    </p>
                                }
                            </div>
                    </div>
                </section>
                <section id="content-part-2" className="px-8 sm:px-16 mt-5 flex flex-col gap-4">
                    {eventInfo.registration &&
                    <div className="flex flex-col items-start gap-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                            <h2 className="font-inter text-lg sm:text-xl md:text-2xl font-medium">Registration Link:</h2>
                            <p className="font-inter text-base sm:text-lg md:text-xl whitespace-pre-wrap break-words overflow-hidden">
                                Click <span className="cursor-pointer underline -mx-1 px-1 -my-2.5 py-2.5 sm:-mx-0 sm:px-0" onClick={() => window.open(eventInfo.registration, "_blank")}>Here</span>
                            </p>
                        </div>
        
                        {eventInfo.registration_deadline &&
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                            <h2 className="font-inter text-lg sm:text-xl md:text-2xl font-medium">Registration Deadline:</h2>
                            <p className="font-inter text-base sm:text-lg md:text-xl whitespace-pre-wrap break-words overflow-hidden">
                                {getRegistrationDeadline(eventInfo.registration_deadline)}
                            </p>
                        </div>
                        }
                        <hr className="mt-2"/>
                    </div>
                    }
                    <div>
                        <h2 className="font-inter text-lg sm:text-xl md:text-2xl font-medium">About the Event</h2>
                        <p className="font-inter text-sm sm:text-base mt-2 whitespace-pre-wrap break-words overflow-hidden">
                            {eventInfo.about}
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default EventPage;