import Image from "next/image";
import { useState, useEffect } from "react";
import imdbAPI from "./api/imdb_API";
import weatherAPI from "./api/weather_API";
import { NextPage } from "next";
import styles from "@/styles/Homepage.module.css";
import Link from "next/link";
import Carousel from "react-slick";
import EighteenUpRatingOutlinedIcon from "@mui/icons-material/EighteenUpRatingOutlined";
import MovieRoundedIcon from "@mui/icons-material/MovieRounded";
import RecentActorsRoundedIcon from "@mui/icons-material/RecentActorsRounded";
const slickSettings = {
  dots: false,
  infinite: true,
  speed: 2000,
  slidesToShow: 5,
  slidesToScroll: 5,
  autoplaySpeed: 10000,
  autoplay: true,
  cssEase: "linear",
  arrows: false,
};
const Homepage: NextPage = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    console.log("Image failed to load");
  };
  const [allGenres, setAllGenres] = useState<any>();
  const [movieWeekData, setMovieWeekData] = useState<any>();
  const [personWeekData, setPersonWeekData] = useState<any>();
  const [weatherData, setWeatherData] = useState<any>();
  const [weatherCode, setWeatherCode] = useState<any>();
  const [weatherCity, setWeatherCity] = useState<any>();
  useEffect(() => {
    const getAllGenres = async () => {
      const data: any = await imdbAPI.getAllGenres();
      // console.log(data);
      setAllGenres(data);
    };
    const getWeather = async () => {
      const data: any = await weatherAPI.getWeather();
      // console.log(data);
      setWeatherCode(data.match(/<weather[^>]*\bnumber="(\d+)"/)[1]);
      setWeatherCity(data.match(/<city[^>]*\bname="([^"]+)"/)[1]);
      setWeatherData(data);
    };
    const getMovieWeeks = async () => {
      const data: any = await imdbAPI.getTrendingMovieWeek();
      // console.log(data);
      setMovieWeekData(data);
    };
    const getPersonWeeks = async () => {
      const data: any = await imdbAPI.getTrendingPersonWeek();
      // console.log(data);
      setPersonWeekData(data);
    };
    getAllGenres();
    getWeather();
    getMovieWeeks();
    getPersonWeeks();
  }, []);
  if (movieWeekData && personWeekData && allGenres) {
    return (
      <section className={styles["homepage"]}>
        <div className="preload-image"></div>
        <section className={styles["opening-container"]}>
          <div className={styles["opening"] + " page-limit"}>
            <div className={styles["title"]}>
              <>{"Lights out, let's explore the movie universe."}</>
            </div>
            <div className={styles["sub-title"]}>
              {weatherData && weatherCode ? (
                <>
                  {weatherCode >= 200 && weatherCode < 300 ? (
                    <>
                      Sunny skies in {weatherCity}, perfect time to cozy up with
                      a movie!
                    </>
                  ) : weatherCode >= 500 && weatherCode < 600 ? (
                    <>
                      Rainy days in {weatherCity} are made for movie marathons.
                      Grab some popcorn and enjoy!
                    </>
                  ) : weatherCode >= 600 && weatherCode < 700 ? (
                    <>
                      Snowed in {weatherCity}? {"Don't worry"}, {"we've"} got
                      the perfect movies to keep you entertained all day.
                    </>
                  ) : weatherCode >= 700 && weatherCode < 800 ? (
                    <>
                      Foggy days in {weatherCity} call for a warm cup of coffee
                      and a good movie.
                    </>
                  ) : weatherCode >= 800 && weatherCode < 900 ? (
                    <>
                      When the thunder rolls in {weatherCity}, {"it's"} the
                      perfect time to curl up with a movie and forget about the
                      storm outside.
                    </>
                  ) : (
                    <>Discover your new obsession - pick your interest!</>
                  )}
                </>
              ) : (
                <>Discover your new obsession - pick your interest!</>
              )}
            </div>
            {/* <div className={styles["search-bar"]}>
            <TextField
              sx={{
                width: "100%",
                "& .MuiInputLabel-root": {},
                "& .MuiOutlinedInput-input": {
                  padding: "0.75rem 0.75rem",
                },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgb(var(--white))",
                  color: "rgb(var(--black))",
                  borderRadius: "0rem",
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
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </div> */}
            <div className={styles["options"]}>
              <div className={styles["box"]}>
                <Link href="/movies">
                  <div className={styles["screen"]}>
                    <div
                      className={styles["image"] + " " + styles["img-movie"]}
                    ></div>
                    <div className={styles["overlay"]}></div>
                    <div className={styles["action"]}>The Movies</div>
                  </div>
                </Link>
              </div>
              <div className={styles["box"]}>
                <Link href="/persons">
                  <div className={styles["screen"]}>
                    <div
                      className={styles["image"] + " " + styles["img-person"]}
                    ></div>
                    <div className={styles["overlay"]}></div>
                    <div className={styles["action"]}>The Persons</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className={styles["movies-container"]}>
          <div className={styles["movies"] + " page-limit"}>
            <div className={styles["title"]}>Trending Movies This Week</div>
            <div className={styles["movies-carousel"]}>
              <Carousel {...slickSettings}>
                {movieWeekData &&
                  movieWeekData.results.map((movie: any) => (
                    <div key={movie.id} className={styles["movie-wrapper"]}>
                      <Link href={"/movies/" + movie.id}>
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
                          <div className={styles["movie-image"]}>
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
                      </Link>
                    </div>
                  ))}
              </Carousel>
            </div>
            {/* <div className={styles["show-more-wrapper"]}>
              <Link href="/">
                <div className={styles["show-more"]}>
                  Show More
                  <MovieRoundedIcon
                    fontSize="medium"
                    sx={{ marginLeft: "0.5rem" }}
                  />
                </div>
              </Link>
            </div> */}
          </div>
        </section>
        <section className={styles["quote-container"]}>
          <div className={styles["quote"] + " page-limit"}>
            {'"The'} best actors are the ones who {"don't"} do anything but are
            doing everything at the same {'time."'} - William Hurt
          </div>
        </section>

        <section className={styles["persons-container"]}>
          <div className={styles["persons"] + " page-limit"}>
            <div className={styles["title"]}>Trending Persons This Week</div>
            <div className={styles["persons-carousel"]}>
              <Carousel {...slickSettings}>
                {personWeekData &&
                  personWeekData.results.map((person: any) => (
                    <div key={person.id} className={styles["person-wrapper"]}>
                      <Link href={"/persons/" + person.id}>
                        <div
                          className={styles["person"]}
                          style={{
                            backgroundColor:
                              person.gender == 2
                                ? "rgb(var(--primary-theme))"
                                : "rgb(var(--secondary-theme))",
                          }}
                        >
                          <div className={styles["person-image"]}>
                            {person.profile_path && (
                              <Image
                                src={person.profile_path}
                                width={100}
                                height={100}
                                alt=""
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                              />
                            )}
                          </div>

                          <div className={styles["person-text"]}>
                            <div className={styles["name"]}>{person.name}</div>
                            <div className={styles["shows"]}>
                              {person &&
                                person.known_for.map((show: any) => (
                                  <div
                                    key={show["id"]}
                                    className={styles["show-wrapper"]}
                                  >
                                    <div className={styles["show"]}>
                                      {show.title}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
              </Carousel>
            </div>
            {/* <div className={styles["show-more-wrapper"]}>
              <Link href="/">
                <div className={styles["show-more"]}>
                  Show More
                  <RecentActorsRoundedIcon
                    fontSize="medium"
                    sx={{ marginLeft: "0.5rem" }}
                  />
                </div>
              </Link>
            </div> */}
          </div>
        </section>
      </section>
    );
  } else {
    return <>Fetching Data</>;
  }
};

export default Homepage;
