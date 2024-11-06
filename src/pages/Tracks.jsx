import React, { useEffect, useState, useCallback, useRef } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Artists() {
    const navigate = useNavigate();
    const token = window.localStorage.getItem("token");
    const [timeRange, setTimeRange] = useState("short_term");
    const [tracks, setTracks] = useState([]);
    const [artists, setArtists] = useState([]);
    const [albumImages, setAlbumImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
    const audioRef = useRef(null);
    const [hoveredIndex, setHoveredIndex] = useState(-1);

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    const fetchTracks = useCallback(() => {
        audioRef.current.volume = 0.2;
        if (token) {
            axios(`https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=50&offset=0`, {
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + token }
            })
            .then(response => {
                let tracks_array = [];
                let artists_array = [];
                let albumImages_array = [];
                let previews_array = [];
                response.data.items.map((item) => {
                    tracks_array.push(item.name);
                    artists_array.push(item.artists.map(artist => artist.name).join(", "));
                    albumImages_array.push(item.album.images[0].url);
                    previews_array.push(item.preview_url);
                });
                setTracks(tracks_array);
                setArtists(artists_array);
                setAlbumImages(albumImages_array);
                setPreviews(previews_array);
            });
        }
    }, [timeRange, token]);

    useEffect(() => {
        fetchTracks();
    }, [fetchTracks]);

    const playPreview = (previewUrl, index) => {
        if (audioRef.current) {
            if (currentTrackIndex === index) {
                audioRef.current.pause();
                setCurrentTrackIndex(null);
            } else {
                audioRef.current.src = previewUrl;
                audioRef.current.play();
                setCurrentTrackIndex(index);
            }
        }
    };


    return (
        <div className="tracks-page bg-[var(--color1)] min-h-dvh duration-700">
            <Navbar />
            <div className="tracks-container flex flex-col text-[var(--color5)] items-center duration-700">
                <div className="time-range-container flex justify-around mt-10 xl:w-1/3 w-1/2 min-w-[300px] mx-5 bg-[var(--color2)] py-2 px-3 rounded-2xl shadow-md gap-3 duration-700">
                    <div className="time-range-item py-1 px-4 rounded-lg flex justify-center text-center items-center duration-200 cursor-pointer hover:bg-[var(--color3)] hover:scale-105 hover:shadow-lg" onClick={() => setTimeRange("short_term")}>
                        last 4 weeks
                    </div>
                    <div className="time-range-item py-1 px-4 rounded-lg flex justify-center text-center items-center duration-200 cursor-pointer hover:bg-[var(--color3)] hover:scale-105 hover:shadow-lg" onClick={() => setTimeRange("medium_term")}>
                        last 6 months
                    </div>
                    <div className="time-range-item py-1 px-4 rounded-lg flex justify-center text-center items-center duration-200 cursor-pointer hover:bg-[var(--color3)] hover:scale-105 hover:shadow-lg" onClick={() => setTimeRange("long_term")}>
                        All time
                    </div>
                </div>

                <div className="tracks-body text-sm flex flex-col sm:w-4/5 w-[90%] items-center my-10 shadow-2xl shadow-[var(--color2)] duration-200">
                    <div className="track-header w-full rounded-xl scale-[1.01] bg-[var(--color3)] h-10 flex justify-around shadow-md shadow-[var(--color3)] px-2">
                        <div className="track-number w-[3%] translate-x-2 min-w-4 flex items-center justify-center sm:opacity-100 opacity-0">No.</div>
                        <div className="track-album-image w-[5%] translate-x-2 sm:min-w-16 min-w-11 flex items-center justify-center sm:opacity-100 opacity-0">Album</div>
                        <div className="track-name w-[50%] translate-x-2 flex items-center">Track</div>
                        <div className="track-artists w-[42%] translate-x-1 flex items-center">Artists</div>
                    </div>

                    <div className="track-body w-full pt-2 bg-[var(--color2)] duration-200">
                        {tracks.map((track, id) => (
                            <div key={id} className="track-item py-1 cursor-pointer flex gap-1 px-2 bg-[var(--color2)] rounded-xl duration-200 hover:shadow-xl hover:scale-105 hover:bg-[var(--color3)] w-full" onClick={() => playPreview(previews[id], id)} onMouseEnter={() => setHoveredIndex(id)} 
                            onMouseLeave={() => setHoveredIndex(-1)} >
                                <div className="track-number w-[3%] min-w-4 flex items-center justify-center">{id+1}.</div>
                                <div className="track-album-image w-[5%] sm:min-w-16 min-w-11 flex items-center justify-center">
                                    <img src={albumImages[id]} className={`sm:w-12 w-9 rounded-xl shadow-sm shadow-[var(--color2)] ${currentTrackIndex === id ? "blur-[1px]" : ""} duration-200`} alt=""/>
                                    <img src="/play-button.svg" alt="" className={`absolute ${hoveredIndex === id && currentTrackIndex !== id ? "opacity-100 z-10" : "opacity-0 z-0"} drop-shadow-[0_0px_3px_rgba(0,0,0,1)] w-5 duration-200`}/>
                                    <img src="/pause-button.svg" alt="" className={`opacity-0 z-0 drop-shadow-[0_0px_3px_rgba(0,0,0,1)] ${currentTrackIndex === id ? "opacity-100" : ""} w-5 absolute duration-200`} />
                                </div>
                                <div className="track-name w-[50%] flex items-center" >{track}</div>
                                <div className="track-artists w-[42%] flex items-center">{artists[id]}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <audio ref={audioRef} className="absolute" style={{ display: 'none' }} controls />
        </div>
    );
}

export default Artists;
