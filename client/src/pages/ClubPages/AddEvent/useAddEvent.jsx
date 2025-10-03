import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";  
import { useNavigate } from "react-router";
import { getEvent } from "../../../../util/common";
import { convertTime } from "../../../../util/date_to_string";

function getDate_Time() {
    const today = new Date();
    let year = `${today.getFullYear()}`;
    let month = today.getMonth()+1;
    let date = today.getDate();
    let hour = today.getHours();
    let minute = today.getMinutes();

    if (month < 10) {month = `0${month}`;}
    else {month = `${month}`;}

    if (date < 10) {date = `0${date}`;}
    else {date = `${date}`;}

    if (hour < 10) {hour = `0${hour}`;}
    else {hour = `${hour}`;}

    if (minute < 10) {minute = `0${minute}`;}
    else {minute = `${minute}`;}

    return (year + '-' + month + '-' + date + 'T' + hour + ":" + minute);
}

function getDate() {
    const today = new Date();
    let year = `${today.getFullYear()}`;
    let month = today.getMonth()+1;
    let date = today.getDate();

    if (month < 10) {month = `0${month}`;}
    else {month = `${month}`;}

    if (date < 10) {date = `0${date}`;}
    else {date = `${date}`;}

    return (year + '-' + month + '-' + date);
}


function useAddEvent() {
    const [status, setStatus] = useState(null) //null -> new event, event_slug -> editing the respective event
    const [name, setName] = useState("");
    const [about, setAbout] = useState("");
    const [date, setDate] = useState(getDate());
    const [venue, setVenue] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [registration, setRegistration] = useState("");
    const [registration_deadline, setRegistration_deadline] = useState("");

    const [message, setMessage] = useState(null);

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);

    const navigate = useNavigate();

    const timeoutRef = useRef(null);
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        }
    }, [])

    //MUTATION TO HANDLE NEW EVENTS
    const NewMutation = useMutation({
        mutationFn: async (data) => {
            const result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/events/${user.userData.user_slug}/new`, {
                method: "POST",
                credentials: "include",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            });

            const result_data = await result.json();
            if (!result.ok) {throw new Error();}
            return result_data.event_slug

        },
        onSuccess: (event_slug) => {
            setMessage("Event Created Successfully\nRedirecting in 5 seconds");
            queryClient.refetchQueries(["events"]);
            timeoutRef.current = setTimeout(() => {
                navigate(`/${user.userData.user_slug}/events/${event_slug}`);
            }, 5000);
        },
        onError: () => setMessage("Cannot connect to server.\nPlease try Later")
    });

    //MUTATION TO HANDLE EDIT EVENTS
    const EditMutation = useMutation({
        mutationFn: async (data) => {
            const result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/events/${user.userData.user_slug}/${status}/edit`, {
                method: "PUT",
                credentials: "include",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data),
            });
            
            if (!result.ok) {throw new Error();}
        },
        onSuccess:  () => {
            setMessage("Event edited successfully\nRedirecting in 5 seconds");
            timeoutRef.current = setTimeout(() => {
                navigate(`/${user.userData.user_slug}/events/${status}`);
            }, 5000);
            queryClient.refetchQueries(["events"]);
            queryClient.refetchQueries(["event", user.userData.user_slug, status]);
            queryClient.refetchQueries(["events", `${user.userData.user_slug}`]);
        },
        onError: () => setMessage("Cannot connect to the server\nPlease try again later")
    })

    async function setEverything(event_slug) {
        
        let data = queryClient.getQueryData(["event", user.userData.user_slug, event_slug]);
        if (!data) {
            try {
                data = await getEvent(user.userData.user_slug, event_slug);
            } catch (err) {
                navigate("/club/add-event", {replace: true});
                return true;
            }
        }

        setStatus(event_slug);
        setName(data.name);
        setAbout(data.about);

        const now = new Date();

        if (now >= data.date) {
            return false;
        }

        let month = `${data.date.getMonth()+1}`;
        if (month < 10) {month = `0${month}`;}

        let day = `${data.date.getDate()}`;
        if (day < 10) {day = `0${day}`;}

        setDate(`${data.date.getFullYear()}-${month}-${day}`);

        (data.venue === "TBA") ? null:setVenue(data.venue);

        setStartTime(convertTime(data.startTime) || "");
        setEndTime(convertTime(data.endTime) || "");

        setRegistration(data.registration || "");
        console.log(data.registration_deadline);
        if (data.registration_deadline) {
            const deadline = new Date(data.registration_deadline);

            month = `${deadline.getMonth()+1}`;
            if (month < 10) {month = `0${month}`;}

            day = `${deadline.getDate()}`;
            if (day < 10) {day = `0${day}`;}

            let hour = `${deadline.getHours()}`;
            if (hour < 10) {hour = `0${hour}`;}

            let minutes = `${deadline.getMinutes()}`;
            if (minutes < 10) {minutes = `0${minutes}`;}


            setRegistration_deadline(`${deadline.getFullYear()}-${month}-${day}T${hour}:${minutes}`);
        }

        return true;
    }

    const handleChange = (e) => {
        if (e.target.name === "name") {setName(e.target.value);}
        else if (e.target.name === "about") {
            setAbout(e.target.value);
            const el = e.target;
            el.style.height = "auto"; // reset
            el.style.height = Math.min(el.scrollHeight) + "px";
        }
        else if (e.target.name === "date") {setDate(e.target.value);}
        else if (e.target.name === "venue") {setVenue(e.target.value);}
        else if (e.target.name === "start-time") {setStartTime(e.target.value);}
        else if (e.target.name === "end-time") {setEndTime(e.target.value);}
        else if (e.target.name === "registration") {setRegistration(e.target.value);}
        else if (e.target.name === "registration-deadline") {setRegistration_deadline(e.target.value);}
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!e.target.reportValidity()) {return;}
        else {
            const now = new Date();

            const start = startTime.length ? new Date(parseInt(date.slice(0,4)), parseInt(date.slice(5,7))-1, parseInt(date.slice(8,10)), parseInt(startTime.slice(0,2)), parseInt(startTime.slice(3))) : null;
            const end = endTime.length ? new Date(parseInt(date.slice(0,4)), parseInt(date.slice(5,7))-1, parseInt(date.slice(8,10)), parseInt(endTime.slice(0,2)), parseInt(endTime.slice(3))) : null;

            if (start && now > start) {setMessage("Event starting time cannot be before the current time"); return;}
            else if (start && end && start > end) {setMessage("Event cannot start after the end time"); return;}
            else if (end && now > end) {setMessage("Event cannot end after the current time"); return;}
            else if (registration_deadline.length !== 0) {
                const entered_date = new Date(parseInt(date.slice(0,4)), parseInt(date.slice(5,7))-1, parseInt(date.slice(8,10)));
                
                const [datePart, timePart] = registration_deadline.split("T");
                const [year, month, day] = datePart.split("-").map(Number);
                const [hour, minute] = timePart.split(":").map(Number);

                const deadline = new Date(year, month - 1, day, hour, minute);

                if ((start && deadline > start) || (end && deadline > end) || (!start && !end && deadline > entered_date)) {
                    setMessage("Please enter a valid registration deadline");
                    return;
                } 
            }
        }

        const data = {
            name: name,
            about: about,
            date: date,
        };

        if (venue.length) {data.venue = venue;}
        if (startTime.length) {data.startTime = new Date(`${date}T${startTime}:00`).toISOString();}
        if (endTime.length) {data.endTime = new Date(`${date}T${endTime}:00`).toISOString();}
        if (registration.length !== 0) {data.registration = registration;}
        if (registration_deadline.length !== 0) {
            const [datePart, timePart] = registration_deadline.split("T");
            const [year, month, day] = datePart.split("-").map(Number);
            const [hour, minute] = timePart.split(":").map(Number);

            data.registration_deadline = new Date(year, month - 1, day, hour, minute);
        }

        if (!status) {NewMutation.mutate(data);}
        else {EditMutation.mutate(data);}
    }
    

    return {setEverything, name, about, date, venue, startTime, endTime, registration, registration_deadline, handleChange, getDate: getDate(), getDate_Time: getDate_Time(), message, setMessage, isLoading: NewMutation.isPending || EditMutation.isPending, isSuccess: NewMutation.isSuccess || EditMutation.isSuccess, handleSubmit};
}

export default useAddEvent;