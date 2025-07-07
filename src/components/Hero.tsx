import { useEffect, useState, type FC } from "react"
import { useMovieContext } from "../context/MovieContext";
import { Info, Play, Volume2, VolumeOff } from "lucide-react";
import { tmdbApi } from "../tmdb.Api";
import VideoPlayer from "./VideoPlayer";
import { useNavigate } from "react-router-dom";

export const Hero: FC = () => {

    const { selectedMovie, trailerUrl, setTrailerUrl, playerMuted, 
        setPlayerMuted, isModalOpen, setModalOpen } = useMovieContext()

    const [volumeClick, setVolumeClick] = useState<boolean>(false)

    // Chamar a API para trailer do youtube
    useEffect(() => {
        const fetchTrailer = async () => {
            if (selectedMovie) {
                const trailerRes = await tmdbApi.getMovieTrailer(selectedMovie.id);
                //tratamento de erro
                if (trailerRes.error) {
                    setTrailerUrl("")
                }
                else if (trailerRes.data) {
                    setTrailerUrl(trailerRes.data.results[0].key)
                }
            }
        }
        fetchTrailer()
    }, [selectedMovie]);

    const navigate = useNavigate();

    const toggleMuted = (() => {
        setPlayerMuted(!playerMuted)
    })

    const clickWhite = () => {
        setVolumeClick(true);
        setTimeout(() => setVolumeClick(false), 80);
        toggleMuted()
    };

    return (
        <main className="relative bg-[#141414] overflow-hidden">
            {/*Video Player */}
            {trailerUrl && <VideoPlayer videoId={trailerUrl} customHeight="0" isMuted={playerMuted} />}
            {selectedMovie && !trailerUrl && (
                <img src={`https://image.tmdb.org/t/p/original/${selectedMovie?.backdrop_path}`}
                    alt="movie poster" />
            )}
            {/*Gradient Div */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent">
            </div>
            {/*Movie details */}
            {selectedMovie && (

                <div className="absolute top-[38%] pl-12 w-full z-10">
                    <h1 className="text-6xl md:text-8xl font-bold text-white mb-4">
                        {/* SE window.innerWidth < 768 ENTÃO É MOBILE */}
                        {selectedMovie.title && selectedMovie.title.length > 20 &&
                            window.innerWidth < 768 ? selectedMovie.title.substring(0, 20) + "..."
                            : selectedMovie.title}
                    </h1>
                    <p className="text-sm md:text-lg text-gray-300 hidden md:block mb-6 max-w-lg">
                        {selectedMovie.overview?.substring(0, 150) + "(...)"}
                    </p>
                    <div className="flex flex-wrap items-center">
                        <div className="xs:flex-col flex gap-4">
                            <button
                                onClick={() => {
                                    navigate(`/watch/${trailerUrl}`)
                                }}
                                className="flex items-center gap-2 bg-white text-black px-4 
                            py-2 rounded-md hover:bg-gray-200 hover:scale-108 transition-all">
                                <Play size={20} />
                                <span className="font-semibold">
                                    Play
                                </span>
                            </button>
                            <button 
                            onClick={() => setModalOpen(true)}
                            className="flex items-center gap-2 bg-gray-700 
                            text-white py-2 px-4 rounded-md hover:bg-gray-600 hover:scale-108 transition-all"
                            >
                                <Info size={20} />
                                <span className="font-semibold hidden md:block">
                                    Info
                                </span>
                            </button>
                        </div>
                        <div className="absolute right-0 flex items-center gap-4">
                            <button
                                onClick={clickWhite}
                                className={`flex items-center p-2 border-2 rounded-full transition-all ${volumeClick ? 'bg-white text-black' : 'text-white'}`}>
                                {playerMuted ? <VolumeOff size={20} /> : <Volume2 size={20} />}
                            </button>

                            <div className="bg-gray-600 text-white bg-opacity-60 border-l-2 px-3 py-2">
                                <span>18+</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </main>
    );
};


export default Hero;