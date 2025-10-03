import { useState } from "react";
import { useNavigate } from "react-router";
import { useQueryClient, useMutation } from "@tanstack/react-query";

function validateEmail(email) {
    const emailRegexp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;
    return emailRegexp.test(email);
}

function useStudentLogin() {
    const [register, setRegister] = useState(false);
    const [password, setPassword] = useState("");
    const [viewPassword, setViewPassword] = useState(false);
    const [email, setEmail] = useState("");

    //error states
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);

    function toggleViewPassword() {setViewPassword(!viewPassword);}
    function toggleLoginType() {
        setRegister(!register);
        setEmailError(null);
        setPasswordError(null);
    }

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    //login or register
    const mutation = useMutation({
        mutationFn: async ({data, loginType}) => {
            const result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/student/${loginType}`, {
                method: "POST",
                credentials: "include",
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify(data),
            });

            const result_data = await result.json();

            if (result.ok && result_data.code === "S") {
                queryClient.setQueryData(['user'], {
                    userType: result_data.userType,
                    userData: {
                        username: result_data.username,
                    }
                });

            } else {
                switch (result_data.code) {
                    case "USER_ALREADY_EXISTS":
                        setEmailError("User already exists");
                        break;
                    case "USER_NOT_FOUND":
                        setEmailError("User not found");
                        break;
                    case "INCORRECT_PASSWORD":
                        setPasswordError("Incorrect password");
                        break;
                    case "NO_MANUAL_LOGIN":
                        setEmailError("This account uses Google Login");
                        break;
                    default:
                        alert("Cannot connect to server");
                        return;
                }
                throw new Error();
            }
        },
        onSuccess: () => navigate("/student/dashboard"),
    });

    //google login
    const googleMutation = useMutation({
        mutationFn: async ({token}) => {
            const result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/student/google-login`, {
                method: "POST",
                credentials: "include",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({token: token}),
            });
            
            const result_data = await result.json();
            if (!result.ok) {
                
                if (result_data.code == "NO_GOOGLE_LOGIN") {
                    throw new Error("Please Login Manually");
                } else {
                    throw new Error("Unable to connect to Google Server");
                }
            }
            return result_data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['user'], {
                userType: data.userType,
                userData: {
                    username: data.username,
                }
            });
            navigate("/student/dashboard");
        }
    });



    //checking if email and password are filled or not
    const handleSubmit = (e) => {
        e.preventDefault();
        let hasError = false;

        if (email.length === 0) {
            setEmailError("Email cannot be empty");
            hasError = true;
        } else if (!validateEmail(email)) {
            setEmailError("Invalid Email");
            hasError = true;
        }

        if (password.length === 0) {
            setPasswordError("Password cannot be empty");
            hasError = true;
        }
        if (!hasError) {
            mutation.mutate({
                data: {
                    email: email,
                    password: password,
                },
                loginType: (register ? "register": "login"), 
            });
        }
    }

    const handleChange = (e) => {
        if (e.target.name === "email") {
            setEmail(e.target.value);
            setEmailError(null);
        } 
        if (e.target.name === "password") {
            setPassword(e.target.value);
            setPasswordError(null);
        }
    }

    return {register, email, password, viewPassword, toggleViewPassword, emailError, passwordError, handleChange, 
        loginType: register ? "register": "login",toggleLoginType, handleSubmit, isPending: mutation.isPending || googleMutation.isPending, 
        googleMutation: googleMutation, googleError: googleMutation.error};
}

export default useStudentLogin;