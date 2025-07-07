import { useEffect, useState, type FC } from 'react'
import { tmdbApi } from '../tmdb.Api'
import { useMovieContext } from '../context/MovieContext'
import Hero from '../components/Hero'
import Carousel from '../components/Carousel'


const Home: FC = () => {

  const [genresWithMovies, setGenresWithMovies] = useState<GenreWithMovie[] | null>(null)

  const { popularMovies, setPopularMovies, setSelectedMovie,
    setTopRatedMovies, setTrendingMovies,
    topRatedMovies, trendingMovies } = useMovieContext()

  useEffect(() => {

    const loadMovies = async () => {
      const [popularMoviesResult, topRatedMoviesResult, trendingMoviesResult, allGenres] = await Promise.all([
        tmdbApi.fetchPopularMovies(),
        tmdbApi.fetchTopRatedMovies(),
        tmdbApi.fetchTrendingMovies(),
        tmdbApi.getGenres(),
      ])

      // Tratamento de erros para todos os genres
      if (allGenres.error) {
        console.log(allGenres.error);
        setGenresWithMovies([]);
      }
      else if (allGenres.data) {
        const allGenreWithMovies = await Promise.all(
          allGenres.data?.genres.map(async (genre) => {
            const movies = await tmdbApi.getMoviesByGenre(genre.id);
            console.log(movies);

            return {
              id: genre.id,
              name: genre.name,
              movies: movies.data.results,
            }
          })
        )
        setGenresWithMovies(allGenreWithMovies)
      }

      // Tratamento de erros para todos os filmes populares
      if (popularMoviesResult.error) {
        // definir array de popularMovies como vazia se erro
        setPopularMovies([])
      } else if (popularMoviesResult.data) {
        setPopularMovies(popularMoviesResult.data.results)
        const randomIndex = Math.floor(Math.random() * popularMoviesResult.data?.results.length);
        const randomMovie = popularMoviesResult.data?.results[randomIndex];
        setSelectedMovie(randomMovie);
        console.log(randomMovie)
      }

      // Tratamento de erros para todos os filmes top rated
      if (topRatedMoviesResult.error) {
        // definir array de topRatedMovies como vazia
        setTopRatedMovies([])
      } else if (topRatedMoviesResult.data) {
        setTopRatedMovies(topRatedMoviesResult.data.results)
      }

      // Tratamento de erros para todos os filmes trending
      if (trendingMoviesResult.error) {
        // definir array de trendingMovies
        setTrendingMovies([])
      } else if (trendingMoviesResult.data) {
        setTrendingMovies(trendingMoviesResult.data.results)
      }
    }


    loadMovies()

  }, [])

  return (
    <div>
      <Hero />
      <div className='absolute w-full top-[31vh] md:top-[65vh] lg:top-[85vh] pl-10 pr-10 flex flex-col space-y-4 py-20'>
        {popularMovies && <Carousel title={'Popular'} items={popularMovies} />}
        {trendingMovies && <Carousel title={'Trending'} items={trendingMovies} />}
        {topRatedMovies && <Carousel title={'Top rated movies'} items={topRatedMovies} />}
        {genresWithMovies && genresWithMovies.map((movieList) => (
          
          <Carousel key = {movieList.id} title={`${movieList.name} Movies`} items={movieList.movies} />
        ))}
      </div>
    </div>
  )
}

export default Home