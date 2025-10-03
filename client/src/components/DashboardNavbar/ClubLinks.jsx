import { PlusCircleIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router";

function ClubLinks() {
    const navigate = useNavigate();

    return (
        <>
            <div className="svg-navbar-container" title="Add Event" onClick={() => navigate("/club/add-event")}>
                <PlusCircleIcon className='svg-navbar-style' id="plus-icon"/>
                <label htmlFor="plus-icon" className="text-labelSvg-style">Add Event</label>
            </div>
            <div className="svg-navbar-container" title="My Events" onClick={() => navigate("/club/my-events")}>
                <CalendarDaysIcon className='svg-navbar-style' id="calendar-icon"/>
                <label htmlFor="calendar-icon" className="text-labelSvg-style">My Events</label>
            </div>
        </>
    )
}

export default ClubLinks;