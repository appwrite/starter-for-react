
import { useEffect, useState } from "react";
import Search from "./components/Search.jsx";
import Spinner from "./components/spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import { updateSearchCount, ensureAnonymousSession, validateAppwriteEnv } from "./lib/appwrite.js";





const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [trending, setTrending] = useState([]);


  // Debounce searchTerm updates locally (replaces react-use useDebounce)
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm]);


  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query 
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` 
      :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }


    console.log("API_KEY:", API_KEY ? "Loaded ✅" : "Missing ❌");



      const data = await response.json();

      


      setMovieList(data.results || []);
      if (query && data.results && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Failed to fetch movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }


  };




  
  useEffect(() => {
    validateAppwriteEnv();
    ensureAnonymousSession();
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    (async () => {
      try {
        console.log("Loading trending movies from TMDB...");
        // Use TMDB API to get popular movies as trending
        const response = await fetch(`${API_BASE_URL}/movie/popular`, API_OPTIONS);
        if (!response.ok) {
          throw new Error("Failed to fetch trending movies");
        }
        const data = await response.json();
        console.log("Trending movies from TMDB:", data.results);
        
        // Take only the first 5 movies
        const trendingMovies = data.results.slice(0, 5);
        setTrending(trendingMovies);
        console.log("Set trending movies:", trendingMovies);
      } catch (err) {
        console.warn("Failed to load trending movies:", err);
        setTrending([]);
      }
    })();
  }, []);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
           <img src="./public/hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You&apos;ll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

      <section className="trending">
        <h2>TRENDING MOVIES</h2>
        {trending.length > 0 ? (
          <ul>
            {trending.map((movie, index) => (
              <li key={movie.id}>
                <p>{index + 1}</p>
                <img 
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : './No-Poster.png'} 
                  alt={movie.title}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div>
            <p>Loading trending movies...</p>
          </div>
        )}
      </section>

      <section className="all-movies">
  <h2 className="mt-[40px]">ALL MOVIES</h2>

  {isLoading ? (
<Spinner />
  ) : errorMessage ? (
    <p className="text-red-500">{errorMessage}</p>
  ) : (
    <ul>
      
        {movieList.map((movie) => (
          <MovieCard key={movie.id} movie={movie}  />
        ))}
    
    </ul>
  )}
      </section>












      </div>
    </main>
  );
};

export default App;
