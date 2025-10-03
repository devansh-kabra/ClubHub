import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getClubData } from "../../../../util/common.js";

function useClubLogin() {

    const [password, setPassword] = useState("");
    const [viewPassword, setViewPassword] = useState(false);
    const [club, setClub] = useState("");
    const [clubError, setClubError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);

    //fetching data
    const {data: clubs, isLoading, isError} = useQuery({
        queryKey: ["clubs"],
        queryFn: getClubData,
        staleTime: Infinity,
    });

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (data) => {
            const result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/clubs/login`, {
                method: "POST",
                credentials: "include",
                headers: {'Content-Type': "application/json"},
                body: JSON.stringify(data),
            });

            const result_data = await result.json();
            if (result.ok && result_data.code === "C") {
                queryClient.setQueryData(["user"], {
                    userType: result_data.userType,
                    userData: {
                        username: result_data.username,
                        user_slug: result_data.user_slug,
                        user_color: result_data.user_color,
                    }
                });
                return;
            } else {
                switch (result_data.code) {
                    case "INCORRECT_PASSWORD":
                        setPasswordError("Incorrect Password");
                        break;
                    default:
                        alert("Cannot connect to Server");
                }
                throw new Error();
            }
        },
        onSuccess: () => navigate("/club/dashboard")
    })

    function toggleViewPassword() {setViewPassword(!viewPassword);}

    const handleChange = (e) => {
        if (e.target.name === 'club') {
            setClub(e.target.value);
            setClubError(null);
        }
        if (e.target.name === "password") {
            setPassword(e.target.value);
            setPasswordError(null);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let hasError = false;
        if (club.length === 0) {
            setClubError("Club cannot be none");
            hasError = true;
        }
        if (password.length === 0) {
            setPasswordError("Password cannot be empty");
            hasError = true;
        }
        if (!hasError) {
            mutation.mutate({
                club_slug: club,
                password: password,
            });
        }
    }

    return {clubs, clubs_loading: isLoading, clubs_error: isError, club, password, clubError, passwordError, viewPassword, toggleViewPassword, handleChange, handleSubmit, isLoading: mutation.isPending}
    
}

export default useClubLogin;