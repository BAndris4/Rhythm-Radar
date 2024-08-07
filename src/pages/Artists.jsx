import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Artists() {
    const navigate = useNavigate();
    const token = window.localStorage.getItem("token");
    const [timeRange, setTimeRange] = useState("short_term");
    const [artists, setArtists] = useState([]);
    const [artistImages, setArtistImages] = useState([]);
    const [artistUrls, setArtistUrls] = useState([]);

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
                let artist_names = [];
                let images = [];
                let urls = [];
                response.data.items.map((item) => {
                    artist_names.push(item.name);
                    images.push(item.images[0].url);
                    urls.push(item.external_urls.spotify);
                });
                setArtists(artist_names);
                setArtistImages(images);
                setArtistUrls(urls);
            });
        }
    }, [timeRange, token]);

    useEffect(() => {
        fetchArtists();
    }, [fetchArtists]);

    return (
        <div className="artist-page bg-[var(--color1)] min-h-dvh text-[var(--color5)]">
            <Navbar />
            <div className="artist-container flex flex-col items-center">
                <div className="time-range-container flex justify-around mt-10 xl:w-1/3 w-1/2 min-w-[300px] mx-5 bg-[var(--color2)] py-2 px-3 rounded-2xl shadow-md gap-3">
                    <div className="time-range-item py-1 px-4 rounded-lg flex justify-center text-center items-center duration-200 cursor-pointer hover:bg-[var(--color3)] hover:scale-105 hover:shadow-lg" onClick={() => setTimeRange("short_term")}>
                        last 4 weeks
                    </div>
                    <div className="time-range-item py-1 px-4 rounded-lg flex justify-center text-center items-center duration-200 cursor-pointer hover:bg-[var(--color3)] hover:scale-105 hover:shadow-lg" onClick={() => setTimeRange("medium_term")}>
                        last 6 months
                    </div>
                    <div className="time-range-item py-1 px-4 rounded-lg flex justify-center text-center items-center duration-200 cursor-pointer hover:bg-[var(--color3)] hover:scale-105 hover:shadow-lg" onClick={() => setTimeRange("long_term")}>
                        last 12 months
                    </div>
                </div>
                <div className="artists-list grid grid-cols-2 md:grid-cols-3 bg-[var(--color2)] lg:p-10 p-2 rounded-2xl my-5 lg:gap-x-[5%] gap-x-[2%] lg:gap-y-12 md:gap-y-6 sm:gap-y-2 shadow-xl shadow-[var(--color2)] md:w-2/3 w-[85%]">
                    {artists.map((artist, index) => (
                        <a key={index} href={artistUrls[index]} >
                            <div className="artist-card flex flex-col gap-4 justify-center items-center hover:bg-[var(--color3)] hover:shadow-2xl hover:shadow-[var(--color3)] p-5 rounded-2xl duration-200 hover:scale-105">
                                <img src={artistImages[index]} className="artist-card-image shadow-lg shadow-[var(--color2)] w-56 rounded-2xl cover aspect-square" alt="" />
                                <div className="artist-card-title text-center">{index+1}. {artist}</div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Artists;
