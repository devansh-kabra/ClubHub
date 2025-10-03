import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTimeOfEvent } from "../../../../util/date_to_string.js";
import { toggleBookmark } from "../../../../util/common.js"

async function getMyBookmarks() {

    const result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/student/bookmarks`, {
        method: "GET",
        credentials: "include",
    });
    const data = await result.json();

    let first_event_id = null;
    const now = new Date();

    if (result.ok) {
        return data.bookmarks.map((event) => {
            const date = (event.startTime) ? new Date(event.startTime):new Date(event.date);
            if (!first_event_id && date >= now) {first_event_id = event.id;}

            return {
                id: event.id,
                name: event.name,
                event_slug: event.event_slug,
                club_slug: event.club_slug,
                date: `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`,
                time: getTimeOfEvent(event.startTime, event.endTime),
                venue: event.venue || "TBA",
                first_event_id: first_event_id === event.id,
                upcoming: (date >= now),
            }
        })
    } else {throw new Error("Unable to Connect to Server");}
}

function useBookmarks() {
    const queryClient = useQueryClient();
    
    const query = useQuery({
        queryKey: ["bookmarks"],
        queryFn: async () => getMyBookmarks(),
        staleTime: 1000*60*10,
        
    });

    const remove = useMutation({
        mutationFn: ({id}) => toggleBookmark(id, false),
        onMutate: ({id}) => {
            queryClient.setQueryData(["bookmarks"], (oldData) => {
                if (!oldData) {return [];}
                return oldData.filter(event => event.id != id);
            });
        }
    })

    function removeBookmark(id) {
        remove.mutate({id});
    }


    return {
        data: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        bookmarkRemove: {
            removeBookmark,
            isLoading: remove.isPending
        }
    }
}

export default useBookmarks;