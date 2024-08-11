import { useNavigate } from "react-router-dom";
import React, {useState, useEffect} from "react";

function Login(){
    const navigate = useNavigate();
    const CLIENT_ID = 'fd85cd07269d4216a69488294502475c';
    //const REDIRECT_URI = "http://localhost:5173/";
    const REDIRECT_URI = "https://rhythm-radar.netlify.app/";
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
    const RESPONSE_TYPE = "token";
    const SCOPE = "user-top-read user-read-currently-playing user-read-recently-played user-modify-playback-state user-read-private user-read-email ";

    const [token, setToken] = useState('');

    useEffect( () => {
        const hash = window.location.hash;
        setToken(window.localStorage.getItem("token"));
        let token = window.localStorage.getItem("token");

        
        if (!token && hash){
          token = hash.substring(1).split('&').find(elem => elem.startsWith("access_token")).split('=')[1];
          window.location.hash = "";
          window.localStorage.setItem("token", token);
          setToken(token);   
        }
    }, []);

    useEffect( () => {
        if (token) {
            navigate('/profile');
        }
    }, [token, navigate])

    return(
        
    <div className="login-body bg-[var(--color1)] flex justify-center items-center h-svh">
        {!token ?  
            <div className='login-container bg-[var(--color2)] flex flex-col items-center justify-between h-1/2 p-4 sm:w-[80%] w-72 rounded-3xl shadow-2xl shadow-black'>
                <p className='welcome-text text-[var(--color5)] sm: mt-[5%] sm:text-5xl lg:text-6xl text-2xl '>Rhythm Radar</p>
                <p className='welcome-text text-[var(--color5)] sm:text-2xl lg:text-2xl text-md text-center italic'>Find Your Rhythm, <br />Anywhere, <br />Anytime</p>
                <a className='mb-[3%]' href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}>
                    <div className='login-button bg-[var(--color3)] sm:text-4xl lg:text-5xl text-xl p-5 rounded-2xl shadow-md hover:shadow-[var(--color3)] hover:scale-105 transition-all ease-in-out duration-700' >Login with Spotify</div>
                </a>
            </div>:"" 
        }
    </div>);
}

export default Login;