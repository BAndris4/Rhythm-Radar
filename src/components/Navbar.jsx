import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import NowPlaying from "./NowPlaying";

function Navbar() {
    const navigate = useNavigate();
    let token = window.localStorage.getItem("token");

    const [imgURL, setImgURL] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);


    useEffect(() => {
        if (token) {
            axios("https://api.spotify.com/v1/me/", {
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + token }
            })
            .then(response => {
                console.log(response);
                if(response.data.images.length == 0){
                    setImgURL("/spotify.png")
                }
                setImgURL(response.data.images[1].url);
            })
            .catch(err => {
                console.log(err);
                if (err.response.data.error.status === 401){
                    navigate('/login');
                    window.localStorage.removeItem("token");
                };
            });
        }
    }, [token]);

    return(
        <div className="navbar-container h-[76px] flex lg:justify-between items-center bg-[var(--color2)]">
            
            <div className="closed-navbar z-10 w-1/5 ml-5 lg:w-0">
                <img src="/more.svg" alt="" className={`left-0 lg:left-[-100px] lg:absolute relative w-8 ml-5 hover:scale-110 transition-all ${isOpen ? 'open' : 'closed'} cursor-pointer duration-200`} onClick={handleToggle} />
                <div className={`closed-navbar-panel shadow-md shadow-black transition-all duration-300 absolute mt-[50px] md:h-[120px] w-64 bg-[var(--color2)] rounded-2xl ${isOpen ? 'open' : 'closed'} `} >
                    <div className="navbar-tracks font-semibold px-5 py-2 rounded-t-2xl rounded-b-md transition-all text-[var(--color5)] hover:bg-[var(--color3)] hover:shadow-md hover:shadow-[var(--color3)] hover:scale-[1.01] cursor-pointer hover:text-[var(--color1)] duration-300" onClick={() => {navigate("/tracks"); setIsOpen(false);}}>
                        Tracks
                    </div>
                    <div className="navbar-artists font-semibold px-5 py-2 rounded-md transition-all text-[var(--color5)] hover:bg-[var(--color3)] hover:shadow-md hover:shadow-[var(--color3)] hover:scale-[1.01] cursor-pointer hover:text-[var(--color1)] duration-300" onClick={() => {navigate("/artists"); setIsOpen(false);}}>
                        Artists
                    </div>
                    <div className="navbar-recently-played mb-3 font-semibold px-5 py-2 rounded-t-md rounded-b-2xl transition-all text-[var(--color5)] hover:bg-[var(--color3)] hover:shadow-md hover:shadow-[var(--color3)] hover:scale-[1.01] cursor-pointer hover:text-[var(--color1)] duration-300" onClick={() => {navigate("/recently-played"); setIsOpen(false);}}>
                        Recently Played
                    </div>
                    <NowPlaying placement="1"></NowPlaying>
                </div>
            </div>
            
            <div className="navbar-tabs flex 2xl:w-3/5 lg:w-2/5 justify-start lg:gap-7 xl:gap-12 lg:ml-10 font-semibold absolute lg:relative translate-y-[-200px] lg:translate-y-0">
                <div className="navbar-tracks lg:px-5 lg:py-2 rounded-md transition-all text-[var(--color5)] hover:bg-[var(--color3)] hover:shadow-md hover:shadow-[var(--color3)] hover:scale-105 cursor-pointer hover:text-[var(--color1)] duration-300" onClick={() => {navigate("/tracks")}}>
                    Tracks
                </div>
                <div className="navbar-artists lg:px-5 lg:py-2 rounded-md transition-all text-[var(--color5)] hover:bg-[var(--color3)] hover:shadow-md hover:shadow-[var(--color3)] hover:scale-105 cursor-pointer hover:text-[var(--color1)] duration-300" onClick={() => {navigate("/artists")}}>
                    Artists
                </div>
                <div className="navbar-recently-played lg:px-5 lg:py-2 rounded-md transition-all text-[var(--color5)] hover:bg-[var(--color3)] hover:shadow-md hover:shadow-[var(--color3)] hover:scale-105 cursor-pointer hover:text-[var(--color1)] duration-300" onClick={() => {navigate("/recently-played")}}>
                    Recently Played
                </div>
            </div>
            
            <div className="navbar-right lg:w-[50%] flex lg:justify-between md:justify-end mr-5 ml-auto items-center">
                <NowPlaying placement="0"/>
                <div className="navbar-profile min-w-16">
                    <Menu as="div" className="md:ml-3" >
                        <div className="flex items-center">
                            <MenuButton>
                                <img alt="" src={imgURL} className="h-14 w-14 rounded-full cover hover:scale-[1.15] transition-transform duration-500 shadow-md shadow-black"/>
                            </MenuButton>
                        </div>
                        <MenuItems transition className="absolute font-semibold right-0 z-10 mt-2 mx-5 w-48 origin-top-right rounded-md bg-[var(--color1)] py-1 shadow-md shadow-black transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-300 data-[enter]:ease-out data-[leave]:ease-in">
                            <MenuItem>
                                <a onClick={()=>{navigate("/profile")}} className="block px-4 py-2 text-[var(--color5)] hover:bg-[var(--color2)] duration-200 cursor-pointer">
                                    Your Profile
                                </a>
                            </MenuItem>
                            <MenuItem>
                                <a onClick={() => {navigate('/login'); window.localStorage.removeItem("token"); console.log("Logged out!");}} className="block px-4 py-2 text-[var(--color5)] hover:bg-[var(--color2)] cursor-pointer">
                                    Logout
                                </a>
                            </MenuItem>
                        </MenuItems>
                    </Menu>
                </div>
            </div>
        </div>
        );
    }

export default Navbar;