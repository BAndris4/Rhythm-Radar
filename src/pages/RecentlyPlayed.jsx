import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function RecentlyPlayed() {
    const navigate = useNavigate();
    let token = window.localStorage.getItem("token");

    const [recentTracks, setRecentTracks] = useState([]);
    const [recentArtists, setRecentArtists] = useState([]);
    const [playedAt, setPlayedAt] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [albumImages, setAlbumImages] = useState([]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
    const audioRef = useRef(null);
    const [hoveredIndex, setHoveredIndex] = useState(-1);

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    useEffect(() => {
        audioRef.current.volume = 0.2;
        axios("https://api.spotify.com/v1/me/player/recently-played?limit=50", {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        })
        .then(response => {
            let tracks = [];
            let artists = [];
            let playedat = [];
            let preview = [];
            let images = [];
            for (let i = 0; i < response.data.items.length; i++) {
                tracks.push(response.data.items[i].track.name);
                artists.push(response.data.items[i].track.artists.map(artist => artist.name).join(", "));
                playedat.push(response.data.items[i].played_at);
                preview.push(response.data.items[i].track.preview_url);
                images.push(response.data.items[i].track.album.images[0].url);
            }
            setPlayedAt(playedat);
            setRecentArtists(artists);
            setRecentTracks(tracks);
            setPreviews(preview);
            setAlbumImages(images);
        });
    }, [token]);

    const formatDateLong = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatDateMid = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatDateShort = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

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
        <div className="recently-played-container bg-[var(--color1)] min-h-dvh duration-700">
            <Navbar />
            <div className="flex justify-center duration-700">
                <div className="recently-played-table my-10 text-md w-[90%] sm:w-4/5 shadow-2xl shadow-[var(--color2)] text-[var(--color5)] duration-700">
                    <div className="table-header rounded-xl scale-[1.01] bg-[var(--color3)] h-10 flex justify-around shadow-md shadow-[var(--color3)] text-center">
                        <div className="w-[5%] flex justify-center items-center min-w-14 ">Album</div>
                        <div className="w-[40%] flex items-center px-2">Track</div>
                        <div className="w-[40%] flex items-center px-2">Artist</div>
                        <div className="w-[25%] flex items-center px-2">Played At</div>
                    </div>
                    <div className="table-body pt-2 bg-[var(--color2)] duration-200">
                        {recentTracks.map((track, index) => (
                            <div className="table-body-row cursor-pointer flex bg-[var(--color2)] rounded-xl duration-200 hover:shadow-xl hover:scale-105 hover:bg-[var(--color3)]" onClick={() => playPreview(previews[index], index)} onMouseEnter={() => setHoveredIndex(index)} 
                            onMouseLeave={() => setHoveredIndex(-1)} >
                                <div className="w-[5%] flex items-center justify-center min-w-14 py-1">
                                    <img src={albumImages[index]} className={`w-12 rounded-xl shadow-sm shadow-[var(--color2)] ${currentTrackIndex === index ? "blur-[1px]" : ""} duration-200`} alt=""/>
                                    <img src="/play-button.svg" alt="" className={`absolute ${hoveredIndex === index && currentTrackIndex !== index ? "opacity-100 z-10" : "opacity-0 z-0"} drop-shadow-[0_0px_3px_rgba(0,0,0,1)] w-5 duration-200`}/>
                                    <img src="/pause-button.svg" alt="" className={`opacity-0 z-0 drop-shadow-[0_0px_3px_rgba(0,0,0,1)] ${currentTrackIndex === index ? "opacity-100" : ""} w-5 absolute duration-200`} />
                                </div>
                                <div className="w-[40%] flex items-center px-2">{track}</div>
                                <div className="w-[40%] flex items-center px-2">{recentArtists[index]}</div>
                                <div className="w-[25%] flex items-center px-2 lg:opacity-100 lg:relative opacity-0 absolute">{formatDateLong(playedAt[index])}</div>
                                <div className="w-[25%] flex items-center px-2 lg:opacity-0 lg:absolute sm:opacity-100 sm:relative opacity-0 absolute">{formatDateMid(playedAt[index])}</div>
                                <div className="w-[25%] flex items-center px-2 sm:opacity-0 sm:absolute opacity-100 relative">{formatDateShort(playedAt[index])}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <audio ref={audioRef} className="absolute" style={{ display: 'none' }} controls />

            
        </div>
    );
}

export default RecentlyPlayed;