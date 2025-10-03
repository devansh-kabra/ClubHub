import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import LoginButton from '../../../components/LoginButton';
import Footer from "../../../components/Footer"
import Loading from "../../../components/Loading";
import useClubLogin from './useClubLogin';
import { useNavigate } from 'react-router';
import Navbar from '../../../components/Navbar';

function ClubLogin() {

    const {clubs, clubs_loading, clubs_error, club, password, clubError, passwordError, viewPassword, toggleViewPassword, handleChange, handleSubmit, isLoading} = useClubLogin();
    const navigate = useNavigate();
    
    if (clubs_loading) {
        return <div className='h-screen w-screen flex justify-center items-center'>
            <Loading/>
        </div>
    }
    if (clubs_error) {
        alert("Unable to Connect to Server");
        return;
    }


    return (
        <div id="page-container" className="min-h-screen min-w-full pt-16 lg:pt-20 pb-7 xl:pb-10 relative flex flex-col justify-center items-center">
            <Navbar />

            <div id="club-login-container" className="login-container-style">

                {isLoading && 
                    <div className='h-full w-full flex justify-center items-center z-10 bg-white/50 absolute right-1/2 translate-x-1/2'>
                        <Loading />
                    </div>
                }

                <form className="flex flex-col gap-3">

                    {/* clubname */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="identifier" className="text-labelInput-style">Select Club</label>
                        <select id="identifier" name='club' className="text-input-style" value={club} onChange={handleChange}>
                            <option value={""}>None</option>
                            {clubs.map(function(club) {
                                return (<option key={club.id} value={club.club_slug}>{club.name}</option>);
                            })}
                        </select>
                        {clubError && 
                            <label htmlFor='identifier' className='text-labelInputError-style'>
                                {clubError}
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

                    {/* formsubmit */}
                    <div className='flex justify-center items-center relative'>
                        <LoginButton content="Login" onClick={handleSubmit} />
                    </div> 
                    <div id="login-type" className='flex justify-center'>
                        <p className='font-inter text-xs text-gray-400 italic'>Cannot find your club? 
                            Click <span className='underline cursor-pointer -m-4 p-4' onClick={() => navigate("/club/create")}>here</span>
                        </p>
                    </div>
                </form>
            </div>
            <Footer/>
        </div>
    )
}

export default ClubLogin;