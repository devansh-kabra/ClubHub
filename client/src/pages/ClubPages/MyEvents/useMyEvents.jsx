import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getTimeOfEvent } from "../../../../util/date_to_string";
import { useState } from "react";

async function getMyEvents(club_slug) {
    const result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/events/${club_slug}`, {
        method: "GET",
        credentials: "include",
    });
    const data = await result.json();
    let first_event_id = null;
    let upcoming = false;
    const now = new Date();

    if (result.ok) {
        return data.clubEvents.map((event) => {
            const date = (event.startTime) ? new Date(event.startTime):new Date(event.date);
            if (!first_event_id && date >= now) {first_event_id = event.id;}
            if (date >= now) {upcoming = true;}
            else {upcoming = false;}

            return {
                id: event.id,
                name: event.name,
                event_slug: event.event_slug,
                date: `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`,
                time: getTimeOfEvent(event.startTime, event.endTime),
                venue: event.venue || "TBA",
                first_event_id: first_event_id === event.id,
                upcoming: upcoming,
            }
        })
    } else {throw new Error("Unable to Connect to Server");}
}

function useMyEvents() {

    const queryClient = useQueryClient();

    const user = queryClient.getQueryData(["user"]);
    const query = useQuery({
        queryKey: ["events", `${user.userData.user_slug}`],
        queryFn: async () => getMyEvents(user.userData.user_slug),
        staleTime: Infinity,
    });

    //delete handler
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const deleteMutation = useMutation({
        onMutate: async ({id, event_slug}) => {

            const prevData = queryClient.getQueryData(["events", `${user.userData.user_slug}`]);
            
            queryClient.setQueryData(["events", `${user.userData.user_slug}`], (oldData) => {
                if (!oldData) {return [];}
                return oldData.filter(event => event.id != id);
            });

            return {prevData};

        },
        mutationFn: async ({id, event_slug}) => {

            const update = await fetch(`${import.meta.env.VITE_BACKEND_URL}/events/${user.userData.user_slug}/${event_slug}`, {
                method: "DELETE",
                credentials: "include",
            });

            const update_data = await update.json();

            if (!update.ok) {
                if (update_data.code === "UNAUTHORIZED") {alert("You are not authorised to do so...");}
                else {alert("Difficulty contacting server. The event was not deleted, Please try again later!");}
                throw new Error();
            }
            return;
        },
        onSuccess: (data, varialbes) => {
            queryClient.invalidateQueries(["events"]);
        },
        onError: (err, {id, event_slug}, context) => {
            if (context.prevData) {
                queryClient.setQueryData(["events", `${user.userData.user_slug}`], context.prevData);
            }
        }
    });

    function handleDelete(id, event_slug) {
        deleteMutation.mutate({id, event_slug});
        setDeleteConfirm(null);
    }

    return {
        user: user,
        data: query.data, 
        isLoading: query.isLoading, 
        isError: query.isError, 
        deleteState: {
            deleteConfirm,
            setDeleteConfirm,
            handleDelete,
            isLoading: deleteMutation.isPending,
        },
    };
}

export default useMyEvents;