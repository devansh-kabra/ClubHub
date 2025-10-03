import { GoogleLogin } from "@react-oauth/google";

function GoogleLoginButton({mutation}) {
    return (
        <div className="w-fit rounded-full cursor-pointer">
            <GoogleLogin
                onSuccess={(credentialResponse) => mutation.mutate({token: credentialResponse.credential})}
                onError={() => alert("Unable to connect to Google")}
                
            />
        </div>
    )
}

export default GoogleLoginButton;