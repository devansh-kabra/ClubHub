import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Loading from "../Loading.jsx";
import { useNavigate } from "react-router";

import { useQuery } from "@tanstack/react-query";


async function getAllEventBasic() {
    const result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/events`, {
        method: "GET",
        credentials: "include"
    });
    if (result.ok) {
        const data = await result.json();
        return data.map(event => ({
            id: event.id,
            title: event.name,
            start: (event.start_time === null) ? new Date(event.date):new Date(event.start_time),
            ...(event.end_time !== null && {end: new Date(event.end_time)}),
            color: `${event.color}`,
            extendedProps: {
                link: `/${event.club_slug}/events/${event.event_slug}`,
            },
        }));
    } else {
        throw new Error("Unable to Reach Server!");
    }
}

function EventCalendar() {
    const navigate = useNavigate();

    const query = useQuery({
        queryKey: ["events"],
        queryFn: getAllEventBasic,
        staleTime: Infinity,
    });

    return (
        <div className="h-[calc(100vh-100px)] sm:h-[calc(100vh-80px)] my-3 w-full max-w-[1400px] px-1 mx-auto">
            {query.isLoading && <Loading/>}
            {query.isError && <p>Error: {query.error.message}</p>}
            {query.isSuccess &&
                <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" height={"100%"} fixedWeekCount={false} 
                                events={query.data} displayEventTime={false} eventClick={(e) => navigate(e.event.extendedProps.link)}
                                eventDisplay="block" />
            }
        </div>
    )
}

export default EventCalendar;