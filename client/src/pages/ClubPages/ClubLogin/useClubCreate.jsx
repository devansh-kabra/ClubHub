import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

function useClubCreate() {
    const [name, setName] = useState("");
    const [about, setAbout] = useState("");
    const [genSec, setGenSec] = useState("");
    const [genSecEmail, setGenSecEmail] = useState("");

    const[message, setMessage] = useState(null);

    //mutation
    const mutation = useMutation({
        mutationFn: async (data) => {
            const result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/clubs/new`, {
                method: "POST",
                credentials: "include",
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify(data),
            });

            if (!result.ok) {throw new Error("Cannot connect to Server");}
        },
        onSuccess: () => setMessage("We are verifying the details and will get back to you soon via Gen Sec's email.\n Thank you"),
        error: () => setMessage("Error connecting the Server. Try again later"),
    });

    const handleChange = (e) => {
        switch (e.target.name) {
            case "name":
                setName(e.target.value);
                setMessage(null);
                break;
            case "about":
                setAbout(e.target.value);
                const el = e.target;
                el.style.height = "auto"; // reset
                el.style.height = Math.min(el.scrollHeight) + "px"; 
                setMessage(null);
                break;
            case "genSec":
                setGenSec(e.target.value);
                setMessage(null);
                break;
            case "genSecEmail":
                setGenSecEmail(e.target.value);
                setMessage(null);
                break;
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (name.length === 0) {
            setMessage("Please enter a name for the Club");
            return;
        }

        if (about.length === 0) {
            setMessage("Please enter something about the Club");
            return;
        }

        if (genSec.length === 0) {
            setMessage("Please enter the General Secretary's name");
            return;
        }

        if (genSecEmail.length === 0) {
            setMessage("Please enter the Gen Sec's student email for us to contact");
            return;
        }

        mutation.mutate({name,about,genSec,genSecEmail,});
        return;

    }

    return {name, about, genSec, genSecEmail, handleChange, handleSubmit, isLoading: mutation.isPending, isSuccess: mutation.isSuccess, message, setMessage};
}

export default useClubCreate;