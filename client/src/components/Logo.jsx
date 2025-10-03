import { useNavigate } from "react-router"

function Logo() {

    const navigate = useNavigate();

    return (
        <button className="font-poppins text-black font-bold text-3xl lg:text-4xl -my-2 py-2 sm:-my-1.5 sm:py-1.5 lg:-my-1 lg:py-1 cursor-pointer" onClick={() => navigate("/")}>ClubHub</button>
    )
}

export default Logo;