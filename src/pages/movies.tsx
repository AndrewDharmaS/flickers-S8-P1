import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { NextPage } from "next";
import imdbAPI from "./api/imdb_API";
import styles from "@/styles/Movies.module.css";
import { Grid, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Image from "next/image";
import EighteenUpRatingOutlinedIcon from "@mui/icons-material/EighteenUpRatingOutlined";
import MovieRoundedIcon from "@mui/icons-material/MovieRounded";
const Movie: NextPage = () => {
  const [movieData, setMovieData] = useState<any>();
  const [query, setQuery] = useState("");
  const [lastQuery, setLastQuery] = useState("");
  const [adult, setAdult] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [allGenres, setAllGenres] = useState<any>();
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    console.log("Image failed to load");
  };
  const handleSearch = async (e: any) => {
    e.preventDefault();
    const newData: any = await imdbAPI.searchMovies(query, adult, page);
    setLastQuery(query);
    setMovieData(newData);
    setTotalPages(newData.total_pages);
    setTotalResults(newData.total_results);
    setPage(1);
  };

  const loadMore = async () => {
    const newData: any = await imdbAPI.searchMovies(lastQuery, adult, page + 1);
    // console.log(newData);
    const sendMovie = movieData;
    sendMovie.results = [...movieData.results, ...newData.results];
    setMovieData(sendMovie);
    setPage(page + 1);
  };

  useEffect(() => {
    const getMovieWeeks = async () => {
      const data: any = await imdbAPI.searchMovies(query, adult, page);
      // console.log(data);
      setTotalPages(data.total_pages);
      setTotalResults(data.total_results);
      setMovieData(data);
    };
    const getAllGenres = async () => {
      const data: any = await imdbAPI.getAllGenres();
      // console.log(data);
      setAllGenres(data);
    };
    getMovieWeeks();
    getAllGenres();
  }, []);
  if (movieData && allGenres) {
    return (
      <section className={styles["movies-page"]}>
        <div className={styles["movies-container"] + " page-limit"}>
          <section className={styles["search-wrapper"]}>
            <div className={styles["search-feedback"]}>
              {query == "" ? (
                <span>Tell me, what is it that {"you're"} seeking?</span>
              ) : totalResults > 0 ? (
                <span>
                  We found {totalResults}{" "}
                  {totalResults > 1 ? "entries " : "entry "}
                  for keywords {'"' + lastQuery + '"'}.
                </span>
              ) : (
                <span>We found no entry for keywords {'"' + query + '"'}.</span>
              )}
            </div>
            <div className={styles["search-bar"]}>
              <form onSubmit={handleSearch}>
                <TextField
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  sx={{
                    width: "100%",
                    "& .MuiInputLabel-root": {},
                    "& .MuiOutlinedInput-input": {
                      padding: "0.75rem 0.75rem",
                    },
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgb(var(--white))",
                      color: "rgb(var(--black))",
                      borderRadius: "1rem",
                      width: "100%",
                      fontSize: "1rem",
                      padding: "0rem 0.25rem",
                      "& fieldset": {
                        borderColor: "rgb(var(--primary-theme))",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgb(var(--primary-theme))",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "rgb(var(--primary-theme))",
                      },
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <button type="submit" className="adornment-button">
                          <SearchIcon />
                        </button>
                      </InputAdornment>
                    ),
                  }}
                />
                {/* <label htmlFor="checkbox" className={styles["checkbox-button"]}>
                  <input
                    type="checkbox"
                    name="checkbox"
                    id="checkbox"
                    checked={adult}
                    onChange={(e) => setAdult(e.target.checked)}
                  />
                  <span className={styles["checkbox-label"]}>Adult</span>
                </label> */}
              </form>
            </div>
          </section>
          <section className={styles["results-wrapper"]}>
            <Grid className={styles["results"]} container>
              {movieData &&
                movieData.results.map((movie: any) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={movie.id + page}
                    padding={2}
                  >
                    <Link href={"/movies/" + movie.id}>
                      <div className={styles["movie-wrapper"]}>
                        <div
                          className={styles["movie"]}
                          style={{
                            backgroundColor:
                              movie.vote_count > 0
                                ? "hsl(" +
                                  (
                                    (Math.round(movie.vote_average * 10) /
                                      100) *
                                    120
                                  ).toString(10) +
                                  ", 40%, 50%)"
                                : "rgb(var(--shades-normal))",
                          }}
                        >
                          <div
                            className={styles["movie-image"]}
                            style={{
                              filter: movie.adult ? "blur(3rem)" : "",
                            }}
                          >
                            {movie.poster_path != null ||
                            movie.backdrop_path != null ? (
                              <Image
                                src={
                                  movie.poster_path
                                    ? movie.poster_path
                                    : movie.backdrop_path
                                }
                                width={100}
                                height={100}
                                alt=""
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                              />
                            ) : (
                              <div className={styles["null-image"]}>
                                No Image
                              </div>
                            )}
                            <div
                              className={styles["movie-rating"]}
                              style={{
                                backgroundColor:
                                  movie.vote_count > 0
                                    ? "hsl(" +
                                      (
                                        (Math.round(movie.vote_average * 10) /
                                          100) *
                                        120
                                      ).toString(10) +
                                      ", 40%, 50%)"
                                    : "rgb(var(--shades-normal))",
                              }}
                            >
                              {movie.vote_count > 0
                                ? Math.round(movie.vote_average * 10) + "%"
                                : "?"}
                            </div>
                          </div>
                          <div className={styles["movie-text"]}>
                            <div className={styles["title"]}>{movie.title}</div>
                            <div className={styles["genres"]}>
                              {movie &&
                                movie.genre_ids.map((genreId: any) => {
                                  const genre = allGenres.genres.find(
                                    (g: any) => g.id === genreId
                                  );
                                  return genre ? (
                                    <div
                                      key={genreId}
                                      className={styles["genre-wrapper"]}
                                    >
                                      <div className={styles["genre"]}>
                                        {genre.name}
                                      </div>
                                    </div>
                                  ) : null;
                                })}
                            </div>
                            <div className={styles["others"]}>
                              <div className={styles["release"]}>
                                {movie.release_date}
                              </div>
                              <div className={styles["adult"]}>
                                {movie.adult ? (
                                  <EighteenUpRatingOutlinedIcon fontSize="inherit" />
                                ) : (
                                  <div className={styles["fill"]}></div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Grid>
                ))}
            </Grid>
          </section>
          <section className={styles["load-more"]}>
            {page < totalPages && (
              <button onClick={loadMore} className={styles["show-more"]}>
                Load More
                <MovieRoundedIcon
                  fontSize="medium"
                  sx={{ marginLeft: "0.5rem" }}
                />
              </button>
            )}
          </section>
        </div>
      </section>
    );
  } else {
    return <>Fetching Data</>;
  }
};
export default Movie;
