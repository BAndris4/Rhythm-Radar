import React, {useEffect, useState, useRef} from "react";
import axios from "axios";

function NowPlaying(props){
    
    let token = window.localStorage.getItem("token");
    const intervalRef = useRef(null); 
    const [currentArtists, setCurrentArtists] = useState(["No Artist"]);
    const [currentTrack, setCurrentTrack] = useState("No Track");
    const [progress, setProgress] = useState(0);
    const [albumImage, setAlbumImage] = useState("");
    let placement = Number(props.placement);
    const nextTrack = () => {
        axios("https://api.spotify.com/v1/me/player/next", {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token }
        })
        .catch(err => {
            alert(err.response.data.error.message)
        })
    }
    const previousTrack = () => {
        axios("https://api.spotify.com/v1/me/player/previous", {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token }
        })
        .catch(err => {
            alert(err.response.data.error.message);
        })
    }

    const stopTrack = () => {
        axios("https://api.spotify.com/v1/me/player/play", {
            method: 'PUT',
            headers: { 'Authorization': 'Bearer ' + token }
        })
        .catch( err => {
            console.log(err.response.data.error.message);
        })
    }

    //First request when mounting
    useEffect(() => {
        if (token) {
            axios("https://api.spotify.com/v1/me/player/currently-playing", {
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + token }
            })
            .then(response => {
                //console.log(response.data);
                if (response.data) {
                    setCurrentArtists(response.data.item.artists.map(artist => artist.name));
                    setCurrentTrack(response.data.item.name);
                    setProgress(Math.round(response.data.progress_ms / response.data.item.duration_ms * 100));
                    setAlbumImage(response.data.item.album.images[0].url);
                } else {
                    setCurrentArtists(["No Artist"]);
                    setCurrentTrack("No Track");
                    setProgress(0);
                    setAlbumImage("");
                }
            })
        }
    }, []);

    //Every 10 sec request
    useEffect(() => {
        if (token) {
            intervalRef.current = setInterval(() => {
                axios("https://api.spotify.com/v1/me/player/currently-playing", {
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer ' + token }
                })
                .then(response => {
                    console.log(response.data);
                    if (response.data) {
                        setCurrentArtists(response.data.item.artists.map(artist => artist.name));
                        setCurrentTrack(response.data.item.name);
                        setProgress(Math.round(response.data.progress_ms / response.data.item.duration_ms * 100));
                        setAlbumImage(response.data.item.album.images[0].url);
                        console.log(albumImage);
                    } else {
                        setCurrentArtists(["No Artist"]);
                        setCurrentTrack("No Track");
                        setProgress(0);
                        setAlbumImage("");
                    }
                });
            }, 10000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [token]);

    if (placement == 0){
        return(
            <div className="relative group md:top-0 top-[-200px] md:relative">
            <div className="navbar-now-playing flex items-center py-2 px-3 gap-3 cursor-pointer shadow-md font-semibold min-w-64 rounded-2xl transition-all bg-[#3DA35D] text-[#134611] group-hover:text-[#E8FCCF] group-hover:scale-105">
                <div className="now-playing-image transition-all">
                    <img src={albumImage} alt="" className=" w-12 rounded-md"/>
                </div>
                    
                <div className="now-playing-text transition-all">
                    <div className="now-playing-track text-lg">{currentTrack}</div>
                    <div className="now-playing-artists text-sm">{currentArtists.length<=3 ? currentArtists.join(", ") : `${currentArtists[0]}, ${currentArtists[1]}, ${currentArtists[2]}, ...`}</div>
                </div>
            </div>

            <div className="now-playing-panel z-10 absolute mt-[12px] flex justify-center items-center gap-3 py-1 px-5 left-1/2 w-64 bg-[#3DA35D] rounded-2xl opacity-0 transition-all duration-500 delay-300 group-hover:opacity-100 group-hover:scale-105 transform -translate-x-1/2">
                <img src="/src/assets/next-button.svg" className="w-5 h-5 rotate-180 " alt="" onClick={previousTrack} />
                <div className="panel-player bg-[#96E072] rounded-xl w-[90%] h-2" onClick={stopTrack}>
                    <div className="panel-circle bg-[#E8FCCF] h-2 rounded-xl transition-all duration-700" style={{ width: `${progress}%` }}></div>
                </div>    
                <img src="/src/assets/next-button.svg" className="w-5 h-5" alt="" onClick={nextTrack} />
            </div>
        </div>  
        );
    }
    else {
        return(
            <div className="group md:top-[-500px] relative">
                <div className="navbar-now-playing flex items-center py-2 px-3 gap-3 cursor-pointer shadow-md font-semibold min-w-64 rounded-xl transition-all bg-[#3DA35D] text-[#134611] group-hover:text-[#E8FCCF]">
                    <div className="now-playing-image transition-all">
                        <img src={albumImage} alt="" className=" w-12 rounded-md"/>
                    </div>
                        
                    <div className="now-playing-text transition-all">
                        <div className="now-playing-track text-lg">{currentTrack}</div>
                        <div className="now-playing-artists text-sm">{currentArtists.length<=3 ? currentArtists.join(", ") : `${currentArtists[0]}, ${currentArtists[1]}, ${currentArtists[2]}, ...`}</div>
                    </div>
                </div>

                <div className="now-playing-panel z-10 mt-[12px] flex justify-center items-center gap-3 py-1 px-5 w-64 bg-[#3DA35D] rounded-2xl transition-all duration-500 delay-300">
                    <img src="/src/assets/next-button.svg" className="w-5 h-5 rotate-180 " alt="" onClick={previousTrack} />
                    <div className="panel-player bg-[#96E072] rounded-xl w-[90%] h-2 relative" onClick={stopTrack}>
                        <div className="panel-circle bg-[#E8FCCF] h-2 rounded-xl transition-all duration-700" style={{ width: `${progress}%` }}></div>
                    </div>    
                    <img src="/src/assets/next-button.svg" className="w-5 h-5" alt="" onClick={nextTrack} />
                </div>
            </div>  
        );
    }
    

}

export default NowPlaying;