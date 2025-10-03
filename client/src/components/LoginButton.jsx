function LoginButton({ content, onClick }) {

    return (
        <button type="submit" onClick={onClick} 
            className="font-inter text-base sm:text-lg xl:text-xl bg-black text-white py-0 px-0 sm:py-1 sm:px-3 min-h-10 sm:min-h-9 
                    w-35 sm:w-38 xl:w-40 rounded-full cursor-pointer active:scale-95 lg:hover:bg-white lg:hover:border lg:hover:border-black lg:hover:text-black">
            {content}
        </button>
    )
}

export default LoginButton;