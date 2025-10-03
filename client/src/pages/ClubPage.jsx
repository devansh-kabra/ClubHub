import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";

async function getClubData(club_slug) {
    const result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/clubs/${club_slug}`, {
        method: "GET",
        credentials: "include",
    });
    if (result.ok) {
        const data = await result.json();
        return data.data;
    } else {
        throw new Error();
    }
}

function ClubPage() {
    const {club_slug} = useParams();

    const {data: club, isLoading, isError} = useQuery({
        queryKey: ["club", club_slug],
        queryFn: async () => getClubData(club_slug),
        staleTime: Infinity,
    });

    if (isLoading) {return (
        <div className='h-screen w-screen flex justify-center items-center'>
            <Navbar/>
            <Loading/> 
        </div>
    );}
    else if (isError) {return (
        <div className='h-screen w-screen flex justify-center items-center'>
            <Navbar/>
            <p className='text-black'>Event Not Found</p> 
        </div>
    );}

    return (
        <div id="page-container" className="min-h-full min-w-full ">
            <Navbar/>
            <div id="content" className="mt-20 w-full">
                <section id="content-part-1" className="py-4 px-16 w-full bg-[#1a1a1a]  flex items-center justify-center">
                    <div id="title" className="text-white text-center h-full flex flex-col justify-center items-center gap-2">
                            <h1 title="name" className="font-poppins text-3xl sm:text-5xl md:text-7xl mb-2 sm:mb-4 font-semibold leading-normal">{club.name}</h1>
                    </div>
                </section>
                <section id="content-part-2" className="px-8 sm:px-16 mt-5">
                    <div>
                        <h2 className="font-inter text-lg sm:text-xl md:text-2xl font-medium">About the Club</h2>
                        <p className="font-inter text-sm sm:text-base mt-2 whitespace-pre-wrap break-words overflow-hidden">
                            {club.about}
                        </p>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default ClubPage;