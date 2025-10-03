import { useQuery } from "@tanstack/react-query";
import { getClubData } from "../../../util/common";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router";

function AllClubs() {
    const navigate = useNavigate();

    const {data, isLoading, isError} = useQuery({
        queryKey: ["clubs"],
        queryFn: getClubData,
        staleTime: Infinity,
    });

    if (isLoading) {return (
        <div className='min-h-screen min-w-screen flex justify-center items-center'>
            <Navbar/>
            <Loading/> 
        </div>
    );}
    else if (isError) {return (
        <div className='min-h-screen min-w-screen flex justify-center items-center'>
            <Navbar/>
            <p className='text-black'>Events Not Found</p> 
        </div>
    );}


    return (
        <div id="page-container" className="min-h-screen flex flex-col items-center w-full pt-14 lg:pt-16 relative">
            <Navbar />
            <div id="main-container" className="w-[100%] max-w-[640px] ">
                {data.map(function (club) {
                    return (
                        <div id="club-container" key={club.id} className='inset-shadow-xs p-2 overflow-y-auto text-center flex flex-col 
                        cursor-pointer hover:scale-103 active:scale-95 lg:active:scale-98' style={{color: club.color}} onClick={() => navigate(`/${club.club_slug}`)}>
                            <h1 id="title" className="text-xl sm:text-2xl lg:text-3xl font-medium font-poppins mb-1 sm:mb-1.5 lg:mb-2">{club.name}</h1>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default AllClubs;