import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import Navbar from "../components/Navbar";
import Countries from "../components/countries.js"

function Profile(){

    const navigate = useNavigate();
    let token = window.localStorage.getItem("token");

    const [imgURL, setImgURL] = useState("/spotify.png"); 
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [country, setCountry] = useState("");
    const [followers, setFollowers] = useState(0);
    const [link, setLink] = useState("");
    const [product, setProduct] = useState("");
    const [publicPlaylists, setPublicPlaylists] = useState(0);
    const [publicPlaylistImages, setPublicPlaylistImages] = useState([]);
    const [publicPlaylistUrls, setPublicPlaylistUrls] = useState([]);

    useEffect(() => {
        if (!token){
            navigate('/login');
        }
    },[token, navigate]);

    useEffect(() => {
        if (token) {
            axios("https://api.spotify.com/v1/me/", {
              method: 'GET',
              headers: {'Authorization' : 'Bearer ' + token}
            })
            .then(response => {
                setUsername(() => response.data.display_name);
                setEmail(() => response.data.email);
                setCountry(() => response.data.country);
                setFollowers(() => response.data.followers.total);
                setLink(() => response.data.external_urls.spotify);
                setProduct(() => response.data.product);
                
                if (response.data.images.length === 0){
                    setImgURL(() => "/spotify.png");
                }
                else{
                    setImgURL(() => response.data.images[1].url);
                }
                
            })
            
            axios("https://api.spotify.com/v1/me/playlists?limit=50&offset=0", {
                method: 'GET',
                headers: {'Authorization' : 'Bearer ' + token}
              })
            .then(response => {
                const images = response.data.items.map(item => item.images[0].url);
                const urls = response.data.items.map(item => item.external_urls.spotify);
                setPublicPlaylists(() => response.data.items.length);
                setPublicPlaylistImages(() => images);
                setPublicPlaylistUrls(() => urls);
            })
          }
          
    }, []);
    
    const width = publicPlaylists <= 3 ? "150px" : "100px";


    return(
        <div className="profile-page bg-[var(--color1)] min-h-svh">
            <Navbar></Navbar>
            <div className="xl:h-[75svh] xl:flex xl:justify-center xl:items-center">
                <div className="flex-1 profile-container flex xl:flex-row flex-col justify-center xl:gap-12 gap-6">
                    
                    {/*XL-nél kisebb welcome card*/}
                    <div className="profile-welcome-card flex z-0 items-center xl:translate-x-[-6000px] xl:absolute justify-center flex-col gap-3 mt-7 bg-[var(--color2)] hover:bg-[var(--color3)] xl:w-2/5 w-[90%] translate-x-[5%] py-10 shadow-2xl shadow-[var(--color2)] hover:shadow-[var(--color3)] rounded-2xl hover:scale-105 transition-transform duration-300">
                        <a href={link}><img className="profile-pic h-56 w-56 rounded-full cover shadow-md shadow-black hover:scale-110 duration-200" src={imgURL}></img></a>
                        <h2 className="text-3xl font-semibold text-[var(--color5)] hover:text-[var(--color1)] transition-all cursor-pointer duration-200">Welcome {username}!</h2>
                    </div>

                    {/*XL-nél nagyobb bal data card*/}
                    <div className="profile-left-data-card-xl text-center flex flex-col justify-around mt-16 bg-[var(--color2)] hover:bg-[var(--color3)] absolute xl:relative translate-x-[-500px] xl:translate-x-0 w-1/4 p-5 shadow-2xl shadow-[var(--color2)] hover:shadow-[var(--color3)] rounded-2xl hover:scale-110 transition-all duration-300">
                        <h2 className="text-xl font-semibold text-[var(--color5)] hover:text-[var(--color1)] transition-all cursor-pointer duration-200">Email: {email} </h2>
                        <h2 className="text-xl font-semibold text-[var(--color5)] hover:text-[var(--color1)] transition-all cursor-pointer duration-200">Country: {Countries[country]}</h2>
                        <h2 className="text-xl font-semibold text-[var(--color5)] hover:text-[var(--color1)] transition-all cursor-pointer duration-200">Followers: {followers}</h2>
                        <h2 className="text-xl font-semibold text-[var(--color5)] hover:text-[var(--color1)] transition-all cursor-pointer duration-200">Product: {product} </h2>
                        <h2 className="text-xl font-semibold text-[var(--color5)] hover:text-[var(--color1)] transition-all cursor-pointer duration-200">Public playlists: {publicPlaylists} </h2>
                    </div>

                    {/*XL-nél kisebb data cardok*/}
                    <div className="flex flex-col md:flex-row mx-[5%] xl:absolute gap-5 xl:translate-x-[-6000px] my-0">
                        
                        {/*XL-nél kisebb bal data card*/}
                        <div className="profile-left-data-card text-center flex flex-col justify-around bg-[var(--color2)] hover:bg-[var(--color3)] xl:w-1/5 w-full md:w-1/2 p-10 shadow-2xl shadow-[var(--color2)] hover:shadow-[var(--color3)] rounded-2xl hover:scale-105 transition-all duration-300">
                            <h2 className="text-xl font-semibold text-[var(--color5)] hover:text-[var(--color1)] transition-all cursor-pointer duration-200">Email: {email} </h2>
                            <h2 className="text-xl font-semibold text-[var(--color5)] hover:text-[var(--color1)] transition-all cursor-pointer duration-200">Country: {Countries[country]}</h2>
                            <h2 className="text-xl font-semibold text-[var(--color5)] hover:text-[var(--color1)] transition-all cursor-pointer duration-200">Followers: {followers}</h2>
                            <h2 className="text-xl font-semibold text-[var(--color5)] hover:text-[var(--color1)] transition-all cursor-pointer duration-200">Product: {product} </h2>
                            <h2 className="text-xl font-semibold text-[var(--color5)] hover:text-[var(--color1)] transition-all cursor-pointer duration-200">Public playlists: {publicPlaylists} </h2>
                        </div>
                        {/*XL-nél kisebb jobb data card*/}
                        <div className="profile-right-data-card flex justify-evenly items-center bg-[var(--color2)] hover:bg-[var(--color3)] xl:w-1/5 w-full md:w-1/2 py-10 shadow-2xl shadow-[var(--color2)] hover:shadow-[var(--color3)] rounded-2xl hover:scale-105 transition-all duration-300">
                            {publicPlaylists <= 3 ? (
                                publicPlaylistImages.map((image, index) => (
                                    <a href={publicPlaylistUrls[index]} className={`w-1/${publicPlaylists+1}`}> 
                                        <img src={image} key={index} className="w-full aspect-square cover rounded-2xl max-w-[150px] shadow-md shadow-black hover:scale-110 duration-200" /> 
                                    </a>
                                )))
                            :
                            (
                                <div className="flex flex-col w-full gap-10 h-full justify-center">
                                    <div className="flex w-full justify-evenly">
                                        <a href={publicPlaylistUrls[0]} style={{width}}> 
                                            <img src={publicPlaylistImages[0]} key={0} className="aspect-square w-full cover rounded-2xl max-w-[150px] shadow-md shadow-black hover:scale-110 duration-200" /> 
                                        </a>
                                        <a href={publicPlaylistUrls[1]} style={{width}}> 
                                            <img src={publicPlaylistImages[1]} key={1} className="aspect-square w-full cover rounded-2xl max-w-[150px] shadow-md shadow-black hover:scale-110 duration-200" /> 
                                        </a>
                                        {publicPlaylists >= 5 ? (
                                            <a href={publicPlaylistUrls[4]} style={{width}}> 
                                                <img src={publicPlaylistImages[4]} key={4} className="aspect-square w-full cover rounded-2xl max-w-[150px] shadow-md shadow-black hover:scale-110 duration-200" /> 
                                            </a>
                                        ) : ""}
                                    </div>
                                    <div className="flex w-full justify-evenly">
                                        <a href={publicPlaylistUrls[2]} style={{width}}> 
                                            <img src={publicPlaylistImages[2]} key={2} className="aspect-square w-full cover rounded-2xl max-w-[150px] shadow-md shadow-black hover:scale-110 duration-200" /> 
                                        </a>
                                        <a href={publicPlaylistUrls[3]} style={{width}}> 
                                            <img src={publicPlaylistImages[3]} key={3} className="aspect-square w-full cover rounded-2xl max-w-[150px] shadow-md shadow-black hover:scale-110 duration-200" /> 
                                        </a>
                                        {publicPlaylists >= 6 ? (
                                            <a href={publicPlaylistUrls[5]} style={{width}}> 
                                                <img src={publicPlaylistImages[5]} key={5} className="aspect-square w-full cover rounded-2xl max-w-[150px] shadow-md shadow-black hover:scale-110 duration-200" /> 
                                            </a>
                                        ) : ""}
                                    </div>
                                    {publicPlaylists >= 7 ? (
                                        <div className="flex w-full justify-evenly">
                                        <a href={publicPlaylistUrls[6]} style={{width}}> 
                                            <img src={publicPlaylistImages[6]} key={6} className="aspect-square w-full cover rounded-2xl shadow-md max-w-[150px] shadow-black hover:scale-110 duration-200" /> 
                                        </a>
                                        {publicPlaylists >= 8 ? (
                                            <a href={publicPlaylistUrls[7]} style={{width}}> 
                                                <img src={publicPlaylistImages[7]} key={7} className="aspect-square w-full cover rounded-2xl shadow-md max-w-[150px] shadow-black hover:scale-110 duration-200" /> 
                                            </a>
                                        ) : ""}
                                        {publicPlaylists >= 9 ? (
                                            <a href={publicPlaylistUrls[8]} style={{width}}> 
                                                <img src={publicPlaylistImages[8]} key={8} className="aspect-square w-full cover rounded-2xl shadow-md max-w-[150px] shadow-black hover:scale-110 duration-200" /> 
                                            </a>
                                        ) : ""}
                                    </div>
                                    ):""}
                                </div>     
                            )}
                            
                        </div>
                    </div>

                    {/*XL-nél nagyobb welcome card*/}
                    <div className="profile-welcome-card-xl flex items-center translate-x-[-1500px] absolute xl:relative xl:translate-x-0 justify-center flex-col gap-3 mt-16 bg-[var(--color2)] hover:bg-[var(--color3)] xl:w-2/5 w-full py-10 shadow-2xl shadow-[var(--color2)] hover:shadow-[var(--color3)] rounded-2xl hover:scale-110 transition-all duration-300">
                        <a href={link}><img className="profile-pic h-56 w-56 rounded-full cover shadow-md shadow-black hover:scale-110 duration-200" src={imgURL}></img></a>
                        <h2 className="text-3xl font-semibold text-[var(--color5)] hover:text-[var(--color1)] transition-all cursor-pointer duration-200">Welcome {username}!</h2>
                    </div>
                    
                    {/*XL-nél nagyobb jobb data card*/}
                    
                    <div className="profile-data-card-xl flex justify-evenly items-center mt-16 translate-x-[-1500px] xl:translate-x-0 bg-[var(--color2)] hover:bg-[var(--color3)] w-1/4 py-10 shadow-2xl shadow-[var(--color2)] hover:shadow-[var(--color3)] rounded-2xl hover:scale-110 transition-all duration-300">
                        {publicPlaylists <= 3 ? (
                            publicPlaylistImages.map((image, index) => (
                                <a href={publicPlaylistUrls[index]} className={`w-1/${publicPlaylists+1}`}> 
                                    <img src={image} key={index} className="aspect-square w-full max-w-[150px] cover rounded-2xl shadow-md shadow-black hover:scale-110 duration-200" /> 
                                </a>
                            )))
                        :
                        (
                            <div className="flex flex-col w-full gap-10 h-full justify-center">
                                <div className="flex w-full justify-evenly">
                                    <a href={publicPlaylistUrls[0]} style={{width}}> 
                                        <img src={publicPlaylistImages[0]} key={0} className="aspect-square cover w-full rounded-2xl max-w-[150px] shadow-md shadow-[var(--color5)] hover:scale-110 duration-200" /> 
                                    </a>
                                    <a href={publicPlaylistUrls[1]} style={{width}}> 
                                        <img src={publicPlaylistImages[1]} key={1} className="aspect-square cover w-full rounded-2xl max-w-[150px] shadow-md shadow-[var(--color5)] hover:scale-110 duration-200" /> 
                                    </a>
                                    {publicPlaylists >= 5 ? (
                                        <a href={publicPlaylistUrls[4]} style={{width}}> 
                                            <img src={publicPlaylistImages[4]} key={4} className="aspect-square w-full cover rounded-2xl max-w-[150px] shadow-md shadow-[var(--color5)] hover:scale-110 duration-200" /> 
                                        </a>
                                    ) : ""}
                                </div>
                                <div className="flex w-full justify-evenly">
                                    <a href={publicPlaylistUrls[2]} style={{width}}> 
                                        <img src={publicPlaylistImages[2]} key={2} className="aspect-square w-full cover rounded-2xl max-w-[150px] shadow-md shadow-[var(--color5)] hover:scale-110 duration-200" /> 
                                    </a>
                                    <a href={publicPlaylistUrls[3]} style={{width}}> 
                                        <img src={publicPlaylistImages[3]} key={3} className="aspect-square w-full cover rounded-2xl max-w-[150px] shadow-md shadow-[var(--color5)] hover:scale-110 duration-200" /> 
                                    </a>
                                    {publicPlaylists >= 6 ? (
                                        <a href={publicPlaylistUrls[5]} style={{width}}> 
                                            <img src={publicPlaylistImages[5]} key={5} className="aspect-square w-full cover rounded-2xl max-w-[150px] shadow-md shadow-[var(--color5)] hover:scale-110 duration-200" /> 
                                        </a>
                                    ) : ""}
                                </div>
                                {publicPlaylists >= 7 ? (
                                    <div className="flex w-full justify-evenly">
                                    <a href={publicPlaylistUrls[6]} style={{width}}> 
                                        <img src={publicPlaylistImages[6]} key={6} className="aspect-square w-full cover rounded-2xl max-w-[150px] shadow-md shadow-[var(--color5)] hover:scale-110 duration-200" /> 
                                    </a>
                                    {publicPlaylists >= 8 ? (
                                        <a href={publicPlaylistUrls[7]} style={{width}}> 
                                            <img src={publicPlaylistImages[7]} key={7} className="aspect-square w-full cover rounded-2xl max-w-[150px] shadow-md shadow-[var(--color5)] hover:scale-110 duration-200" /> 
                                        </a>
                                    ) : ""}
                                    {publicPlaylists >= 9 ? (
                                        <a href={publicPlaylistUrls[8]} style={{width}}> 
                                            <img src={publicPlaylistImages[8]} key={8} className="aspect-square w-full cover rounded-2xl max-w-[150px] shadow-md shadow-[var(--color5)] hover:scale-110 duration-200" /> 
                                        </a>
                                    ) : ""}
                                </div>
                                ):""}
                            </div>     
                        )}
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;