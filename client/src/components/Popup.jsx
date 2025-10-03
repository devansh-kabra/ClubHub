
export function PopUp_2button(props) {
    return (
        <div id="pop-up" className="h-screen w-screen flex justify-center items-center z-10 bg-white/50 fixed ">   
            <div className="flex flex-col gap-4 w-[280px] lg:w-[340px] h-fit shadow-lg mx-auto px-1.5 py-5 rounded-2xl bg-white ring-1 ring-black/5">
                <p className="font-semibold text-inter text-xl sm:text-2xl text-center text-gray-800">{props.message}</p>
                <div className="flex w-full justify-around">
                    <button onClick={props.onClick1} className="popup-button-style">
                        {props.content1}
                    </button>
                    <button onClick={props.onClick2} className="popup-button-style">
                        {props.content2}
                    </button>
                </div>
            </div>
        </div>
    )
}

export function PopUp(props) {
    return (
        <div id="pop-up" className="h-full w-full flex justify-center items-center z-10 bg-white/50 absolute right-1/2 translate-x-1/2 ">   
            <div className="flex flex-col gap-4 w-[250px] lg:w-[350px] h-fit shadow-lg mx-auto py-5 px-1.5 rounded-2xl bg-white ring-1 ring-black/5 ">
                <p className="font-semibold text-inter text-xl sm:text-2xl text-center text-gray-800">{props.message}</p>
                <div className="flex w-full justify-center">
                    <button onClick={props.onClick} className="popup-button-style">
                        {props.content}
                    </button>
                </div>
            </div>
        </div>
    )
}

export function PopUp_noButton(props) {
    return (
        <div id="pop-up" className="h-full w-full flex justify-center items-center z-10 bg-white/50 absolute right-1/2 translate-x-1/2">   
            <div className="flex flex-col gap-4 w-[250px] lg:w-[350px] h-fit  shadow-lg mx-auto px-1.5 py-5 rounded-2xl bg-white ring-1 ring-black/5">
                <p className="font-semibold text-inter text-xl sm:text-2xl text-center text-gray-800">{props.message}</p>
            </div>
        </div>
    )
}
