import { BookmarkIcon, UserGroupIcon } from "@heroicons/react/24/outline"
import { Navigate, useNavigate } from "react-router"

function StudentLinks() {
    const navigate = useNavigate();

    return (
        <>
            <div className="svg-navbar-container" title="Bookmarked Events" onClick={() => navigate("/student/bookmarks")}>
                <BookmarkIcon className="svg-navbar-style" id="bookmark-icon"/>
                <label htmlFor="bookmark-icon" className="text-labelSvg-style">Bookmarks</label>
            </div>
            <div className="svg-navbar-container" title="All Clubs" onClick={() => navigate("/student/all-clubs")}>
                <UserGroupIcon className="svg-navbar-style" id="group-icon"/>
                <label htmlFor="group-icon" className="text-labelSvg-style">All Clubs</label>
            </div>
        </>
    )
}

export default StudentLinks