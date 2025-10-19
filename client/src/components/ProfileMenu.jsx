import { UserCircleIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import {CheckIcon} from '@heroicons/react/24/solid';
import Loading from "./Loading";

function ProfileMenu() {
    const [open, setOpen] = useState(false);
    const [changeColor, setChangeColor] = useState(false);
    const [color, setColor] = useState(null);
    const [newColor, setNewColor] = useState(null);

    const navigate = useNavigate();

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);

    const userType = user.userType;
    const username = user.userData?.username;

    useEffect(() => {
        if (userType === "club") {
            setColor(user.userData.user_color);
            setNewColor(user.userData.user_color);
        }
    }, [user]);

    function dropdown() {
        setOpen(!open);
    }

    //logout handler
    async function logout() {
        const result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
            method: "GET",
            credentials: "include",
        });
        const result_data = await result.json();

        if (!result.ok) {
            throw new Error(result_data.message) || "Logout Failed";
        } else {
            queryClient.clear();
            queryClient.setQueryData(["user"], {
                userType: null,
                userData: null,
            });
            return;
        }
    }

    const mutation = useMutation({
        mutationFn: logout,
        onSuccess: () => navigate("/"),
        onError: (error) => alert("Cannot contact server"),
    });

    //color edit handler
    const editColorMutation = useMutation({
        mutationFn: async (variables) => {
            const update = await fetch(`${import.meta.env.VITE_BACKEND_URL}/clubs/change-color`, {
                method: "PATCH",
                credentials: "include",
                headers: {'Content-Type': "application/json"},
                body: JSON.stringify({color: newColor}),
            });

            if (!update.ok) {
                throw new Error();
            }
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(["events"]);
            queryClient.refetchQueries(["user"]);
            setChangeColor(false);
            setColor(newColor);
        },
        onError: (err, variables) => {
            alert("Color was not updated");
            setNewColor(color);
            setChangeColor(false);
        }
    })

    function checkNewColor() {
        const hexPattern = /^#[0-9A-Fa-f]{6}$/;
        if (!hexPattern.test(newColor)) {
            setNewColor(color);
            alert("Enter a 6-digit hex color code (e.g. #FF5733).")
            setChangeColor(false);
        } else {
            editColorMutation.mutate({color: newColor}); 
        }
    }


    return (
        <div className='h-14 flex items-center justify-center rounded-full relative'>
            <UserCircleIcon className='h-10 w-10 md:h-11 md:w-11 lg:h-12 lg:w-12 text-black active:text-gray-700 lg:hover:text-gray-700 cursor-pointer' title='Profile' onClick={dropdown}/>

            {open && userType &&
                <div id='dropdown' className='p-2 bg-white inset-shadow-xs shadow-md rounded-xl z-10 absolute right-[-8px] sm:right-[-12px] md:right-[-32px] top-13.5 lg:top-15  w-fit flex flex-col items-center sm:gap-1 '>

                    {(mutation.isPending || editColorMutation.isPending) && 
                        <div className='flex justify-center items-center z-20 h-full w-full absolute bg-white '>
                            <Loading />
                        </div>
                    }

                    <div className='flex flex-col items-center text-center w-fit font-inter text-sm xl:text-base whitespace-nowrap'>
                        <h3 className=''>{userType === "student" ? "Email:":"Club Name:"}</h3>
                        <h3 className=''>{username}</h3>
                        {color && !changeColor &&
                            <div className='cursor-pointer -my-2.5 py-2.5' onClick={()=>setChangeColor(!changeColor)}>   
                                <h4 id='color' className='font-inter flex'>Color: {color}
                                    <span className='inline-block ml-0.5 h-2 w-2 lg:h-2.5 lg:w-2.5 border self-center' style={{backgroundColor: color}}></span>
                                </h4>
                            </div>
                        }
                        {color != null && changeColor &&
                            <div id='new-color-div' className='flex -my-2.5 py-2.5'>
                                <label htmlFor='new-color' className='font-inter whitespace-pre'>Color: </label>
                                <input type='text' id='new-color' value={newColor} autoFocus className='field-sizing-content focus:outline-0' onChange={(e)=>setNewColor(e.target.value)}/>
                                <div className='cursor-pointer self-center flex justify-center items-center -my-3 py-3 -mr-3 pr-3 lg:-my-1 lg:py-1 lg:-mr-1 lg:pr-1' onClick={checkNewColor}>
                                    <CheckIcon className="ml-1.5 h-4 w-4 lg:h-4.5 lg:w-4.5"/>
                                </div>
                            </div>
                        }
                    </div>
                    
                    <div className='flex justify-center items-center w-full min-h-[40px] sm:min-h-[28px]'>
                        <button id='logout' className='font-inter text-sm xl:text-base bg-black text-white py-0 px-0 sm:py-1 sm:px-2 min-h-7 sm:min-h-4
                            w-20 sm:w-24 rounded-3xl cursor-pointer active:scale-95 active:bg-red-600 lg:hover:bg-red-600' onClick={mutation.mutate}>
                                Logout
                        </button>
                    </div>
                </div>
            }

            {/* {} */}
            {open && !userType &&
                <div className='p-2 bg-white inset-shadow-xs shadow-md rounded-xl z-10 absolute right-[-8px] sm:right-[-12px] md:right-[-32px] top-13.5 lg:top-15  w-fit flex flex-col items-center sm:gap-1 '>
                    <button id='logout' className='font-inter text-sm xl:text-base bg-black text-white py-0 px-0 sm:py-1 sm:px-2 min-h-7 sm:min-h-4
                        w-20 sm:w-24 rounded-3xl cursor-pointer active:scale-95 active:bg-white-600 lg:hover:bg-white active:text-black lg:hover:text-black lg:hover:border active:border' onClick={() => navigate("/")}>
                            Login
                    </button>
                </div>
            }

        </div>
    )
}

export default ProfileMenu;