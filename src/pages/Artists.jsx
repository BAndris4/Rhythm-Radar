import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Artists() {
    const navigate = useNavigate();
    const token = window.localStorage.getItem("token");
    const [timeRange, setTimeRange] = useState("short_term");
    const [artists, setArtists] = useState([]);

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    const fetchArtists = useCallback(() => {
        if (token) {
            axios(`https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=50&offset=0`, {
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + token }
            })
            .then(response => {
                setArtists(response.data.items);
                console.log(response.data.items);
            });
        }
    }, [timeRange, token]);

    useEffect(() => {
        fetchArtists();
    }, [fetchArtists]);

    return (
        <div className="artist-container bg-[#E8FCCF] min-h-dvh">
            <Navbar />
            <div className="time-range-container">
                <div className="time-range-4-weeks" onClick={() => setTimeRange("short_term")}>
                    last 4 weeks
                </div>
                <div className="time-range-6-months" onClick={() => setTimeRange("medium_term")}>
                    last 6 months
                </div>
                <div className="time-range-1-year" onClick={() => setTimeRange("long_term")}>
                    last 12 months
                </div>
            </div>
            <div className="artists-list">
                {artists.map((artist) => (
                    <div key={artist.id}>{artist.name}</div>
                ))}
            </div>
        </div>
    );
}

export default Artists;
