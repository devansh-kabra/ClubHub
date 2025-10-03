//used in every event page to fetch data and in edit event
export async function getEvent(club_slug, event_slug) {
    const result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/events/${club_slug}/${event_slug}`, {
        method: "GET",
        credentials: "include",
    });
    const event = await result.json();
    const now = new Date();

    if (result.ok) {
        const date = (event.start_time) ? new Date(event.start_time):new Date(event.date);
   
        return {
            id: Number(event.id),
            name: event.name,
            club: event.club_name,
            date: date,
            startTime: event.start_time,
            endTime: event.end_time,
            venue: event.venue || "TBA",
            about: event.about,
            registration: event.registration,
            registration_deadline: event.registration_deadline,
            upcoming: date > now,
            bookmark: Number(event.bookmark),
            bookmarked: Boolean(event.bookmarked),
        }
    } else {
        if (event.code === "EVENT_REMOVED") {throw new Error("The Event has been Deleted by the club!");}
        else {throw new Error("Unable to connect! to the server");}
    }
}

//used in club login page and all clubs page
export async function getClubData() {
    const result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/clubs`, {
        method: "GET",
        credentials: "include",
    });
    if (result.ok) {
        const data = await result.json();

        return data.map(club => ({
            id: club.id,
            name: club.name,
            club_slug: club.club_slug,
            color: club.color,
        }));

    } else {throw new Error("Unable to reach server");}
}

//used in event page and in bookmarks (student) page
export async function toggleBookmark(event_id, bookmarkState) {
    const update = await fetch(`${import.meta.env.VITE_BACKEND_URL}/student/bookmark`, {
        method: "PATCH",
        credentials: "include",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            eventId: event_id,
            bookmark: bookmarkState
        }),
    });

    if (!update.ok) {throw new Error();}
}