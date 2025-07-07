import axios, { type AxiosRequestConfig } from "axios";
import toast from "react-hot-toast";
// The Movie type is declared globally in types.d.ts, so no import is needed.

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export interface RequestError extends Error {
    // status? te, o ? de opcional
    status?: number;
    details?: any;
}

export interface ApiResponse<T> {
    data: T,
    // inicialmente o erro pode ser indefinido, para a app não crashar usamos " | undefined "
    error?: RequestError | undefined
}

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY
    }
})

// Vamos usar uma função get como um construtor com o base_url para construir o link 
// para conseguir o filme que queremos
const get = async<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    // O tipo Promise representa uma operação assíncrona que eventualmente será concluída,
    // retorna um valor ou um erro 
    try {
        const response = await axiosInstance.get<T>(url, config);
        return { data: response.data }
    } catch (error: any) {
        const status = error?.response?.status;
        const details = error?.response?.data;
        toast.error("Something went wrong. Try again later", {id: "toast"});

        return {
            data: undefined as unknown as T,
            error: {
                message: `Failed to get the data from ${url}`,
                status,
                details,
                name: "TMBD_API_ERROR"
            }
        }
    }

}

// actual apis 
export const tmdbApi = {

    fetchPopularMovies: (page: number = 1) => get<{ results: Movie[] }>(`/movie/popular`, { params: { page } }),

    fetchTrendingMovies: (timeWindow: string = "week") => get<{ results: Movie[] }>(`/trending/movie/${timeWindow}`),

    fetchTopRatedMovies: (page: number = 1) => get<{ results: Movie[] }>(`/movie/top_rated`, { params: { page } }),

    getGenres: () => get<{ genres: Genre[] }>(`/genre/movie/list`),

    getMoviesByGenre: (genreId: number, page: number = 1) => get<{ results: Movie[] }>(`discover/movie`, { params: { with_genres: genreId, page } }),

    // from youtube
    getMovieTrailer: (movieId: number) =>
        get<{ results: Trailer[] }>(`/movie/${movieId}/videos`),

    // get movie details
    getMovieDetails: (movieId: number) =>
        get<MovieDetails>(`/movie/${movieId}`),

    getSimilarMovies: (movieId: number) =>
        get<{ results: Movie[] }>(`/movie/${movieId}/similar`, { params: { page: 1 } }),

    searchMovies: (keyword:string, page: number = 1) =>
        get<{ results: Movie[] }>(`/search/movie`, { params: { query: keyword, page } }),
}
