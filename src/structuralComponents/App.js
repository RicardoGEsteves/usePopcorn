import { useState, useCallback } from "react";
import { Main } from "./Main";
import { NavBar } from "../presentationalComponents/NavBar";
import { Search } from "../statefulComponents/Search";
import { NumResults } from "../presentationalComponents/NumResults";
import { Box } from "../statefulComponents/Box";
import { MovieList } from "../statefulComponents/MovieList";
import { WatchedMovieList } from "../presentationalComponents/WatchedMovieList";
import { WatchedSummary } from "../presentationalComponents/WatchedSummary";
import { Loader } from "../presentationalComponents/Loader";
import { ErrorMessage } from "../presentationalComponents/ErrorMessage";
import { MovieDetails } from "./MovieDetails";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";

const KEY = "ba6a70a7";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const handleCloseMovie = useCallback(function () {
    setSelectedId(null);
  }, []);
  const { movies, isLoading, error } = useMovies(query, KEY, handleCloseMovie);
  const [watched, setWatched] = useLocalStorageState([], "watched");

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleAddWatchedMovie(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              KEY={KEY}
              onAddWatchedMovie={handleAddWatchedMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
