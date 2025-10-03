import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import LoginButton from '../../../components/LoginButton';
import Footer from "../../../components/Footer";
import Loading from '../../../components/Loading';
import useStudentLogin from './useStudentLogin';
import GoogleLoginButton from "../../../components/GoogleLoginButton";
import { PopUp } from '../../../components/Popup';
import Navbar from '../../../components/Navbar';

//this file handles the student login and on every change, the emailError and passwordError are toggled to null in several places

function StudentLogin() {

    const { register, email, password, viewPassword, toggleViewPassword, emailError, passwordError, handleChange, loginType, toggleLoginType, handleSubmit, isPending, googleMutation, googleError} = useStudentLogin();
    

    return (
        <div id="page-container" className="min-h-screen min-w-full pt-16 lg:pt-20 pb-7 xl:pb-10 relative flex flex-col justify-center items-center">
            <Navbar/>
            <div id="student-login-container" className="login-container-style">

                {isPending && 
                    <div className='h-full w-full flex justify-center items-center z-10 bg-white/50 absolute right-1/2 translate-x-1/2'>
                        <Loading />
                    </div>
                }

                {googleError &&
                    <PopUp message={googleError.message} onClick={() => googleMutation.reset()} content={"OK"}/>
                }

                <form className="flex flex-col gap-3">

                    {/* email */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="identifier" className="text-labelInput-style">Student Email</label>
                        <input type="email" name="email" id="identifier" required className="text-input-style" value={email} onChange={handleChange}/>
                        {emailError && 
                            <label className='text-labelInputError-style' htmlFor='identifier'>
                                {emailError}
                            </label>
                        }
                    </div>

                    {/* password */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="password-input" className="flex items-center gap-1 text-labelInput-style">
                            Password 
                            <button type="button" className='svg-button-style' onClick={toggleViewPassword}>
                                {viewPassword ? (<EyeSlashIcon className='w-5 h-5'/>) : (<EyeIcon className='w-5 h-5'/>)}
                            </button>
                        </label>

                        <input type={viewPassword ? "text":"password"} id="password-input" className="text-input-style" 
                                value={password} name="password" onChange={handleChange}/>

                        {passwordError && 
                            <label htmlFor='password-input' className='text-labelInputError-style'>
                                {passwordError}
                            </label>
                        }
                        
                    </div> 

                    <div className='flex justify-center items-center relative mt-2'>
                        <LoginButton content={(loginType === "register") ? "Register" : "Login"} onClick={handleSubmit} />
                    </div> 

                    {/*google login*/}
                    <div className='flex justify-center items-center mt-3'>
                        <GoogleLoginButton mutation={googleMutation}/>
                    </div>

                    <div id="login-type" className='flex justify-center mt-2'>
                        <p className='font-inter text-xs text-gray-400 italic'>{register ? "Have" : "Don't have"} an account? 
                            Click <span className='underline cursor-pointer -m-4 p-4' onClick={toggleLoginType}>here</span>
                        </p>
                    </div>
                </form>
            </div>
            <Footer/>
        </div>
    )
}

export default StudentLogin;