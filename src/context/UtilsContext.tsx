import { createContext, useContext, useState, type FC, type ReactNode } from "react"
import { useCardContext } from "./CardContext";

interface UtilsContextType {
    addToFavoriteList: (movie: Movie) => void,
    movieList: Movie[],
    randomDuration: () => string
}

const UtilsContext = createContext<UtilsContextType | null>(null)

export const UtilsProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [movieList, setMovieList] = useState<Movie[]>(JSON.parse(localStorage.getItem('movieList') || '[]'));

    const { setCardState } = useCardContext();

    const addToFavoriteList = (movie: Movie) => {
        let list = localStorage.getItem('movieList')

        if (list) {
            try {
                const parsedList = JSON.parse(list) as Movie[]

                setMovieList(parsedList)

                const exists = parsedList.some((item: Movie) => item.id === movie.id)

                if (exists) {
                    const newMovieList = parsedList.filter(
                        (item: Movie) => item.id !== movie.id
                    );
                    setMovieList(newMovieList);
                    localStorage.setItem('movieList', JSON.stringify(newMovieList));
                    setCardState((prev) => ({
                        ...prev,
                        isHovered: false,
                        item: null,
                        cardId: null
                    }));
                    return;
                }
            } catch (error) {
                localStorage.removeItem('movieList');
                setMovieList([]);
            }
        }

        // Adicionar o novo filme  
        const newMovieList = [...movieList, movie]
        setMovieList(newMovieList);

        try {
            localStorage.setItem("movieList", JSON.stringify(newMovieList));
        } catch (error) {
            console.error("ERRO AO SALVAR MOVIE PARA LOCAL STORAGE: ", error)
        }
    };

    const randomDuration = () => {
        const randomMinutes = Math.floor(Math.random() * (200 - 60 + 1)) + 60;
        const hours = Math.floor(randomMinutes / 60);
        const minutes = randomMinutes % 60;

        return `${hours}h ${minutes}m`;
    }

    return (
        <UtilsContext.Provider value={{ addToFavoriteList, movieList, randomDuration }}>
            {children}
        </UtilsContext.Provider>
    )

}

export const useUtilsContext = (): UtilsContextType => {
    const context = useContext(UtilsContext);

    if (!context) {
        throw new Error("useUtilsContext must be used within a UtilsProvider")
    }
    return context;
}