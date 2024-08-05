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
    const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
    const audioRef = useRef(null);

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
            console.log(response.data);
            let tracks = [];
            let artists = [];
            let playedat = [];
            let preview = [];
            for (let i = 0; i < response.data.items.length; i++) {
                tracks.push(response.data.items[i].track.name);
                artists.push(response.data.items[i].track.artists.map(artist => artist.name).join(", "));
                playedat.push(response.data.items[i].played_at);
                preview.push(response.data.items[i].track.preview_url);
            }
            setPlayedAt(playedat);
            setRecentArtists(artists);
            setRecentTracks(tracks);
            setPreviews(preview);
        });
    }, [token]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
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
        <div className="recently-played-container bg-[#E8FCCF] min-h-dvh">
            <Navbar />
            <table>
                <thead>
                    <tr className="recently-played-table-header">
                        <td>Artist</td>
                        <td>Track</td>
                        <td>Played at</td>
                    </tr>
                </thead>
                <tbody>
                    {recentTracks.map((track, index) => 
                        <tr key={index} onClick={() => playPreview(previews[index], index)}>
                            <td>{recentArtists[index]}</td>
                            <td>{track}</td>
                            <td>{formatDate(playedAt[index])}</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <audio ref={audioRef} style={{ display: 'none' }} controls />
        </div>
    );
}

export default RecentlyPlayed;