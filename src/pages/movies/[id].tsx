import { NextPage } from "next";
import { useRouter } from "next/router";
import imdbAPI from "../api/imdb_API";
import youtubeAPI from "../api/youtube_API";
import Image from "next/image";
import styles from "@/styles/Movie.module.css";
import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import YouTubeIcon from "@mui/icons-material/YouTube";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
const Movie: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [movieDetail, setMovieDetail] = useState<any>();
  const [youtubeURL, setYoutubeURL] = useState<any>(["None"]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [once, setOnce] = useState(true);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    console.log("Image failed to load");
  };

  const findYoutube = async () => {
    if (once) {
      const data: any = await youtubeAPI.searchRelevant(movieDetail.title);
      // const data = [
      //   "https://www.youtube.com/embed/DuWEEKeJLMI",
      //   "https://www.youtube.com/embed/e-I-YCy7yKY",
      //   "https://www.youtube.com/embed/y8x6oyusAIE",
      // ];
      setYoutubeURL(data);
      // console.log(data);
      setOnce(false);
    }
    // console.log(youtubeURL);
    setOpen(true);
  };

  useEffect(() => {
    const getMovieDetail = async () => {
      const data: any = await imdbAPI.getMovieDetail(id);
      // console.log(data);
      setMovieDetail(data);
    };
    getMovieDetail();
  }, [id]);
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  if (movieDetail) {
    return (
      <section className={styles["movie-page"]}>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute" as "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "fit-content",
              bgcolor: "rgb(var(--primary-black))",
              boxShadow: 24,
              borderRadius: "1rem",
              p: 4,
            }}
          >
            <section className={styles["youtube-wrapper"]}>
              {youtubeURL &&
                youtubeURL.map((url: any) => (
                  <div key={url} className={styles["youtube"]}>
                    <iframe
                      width="420"
                      height="315"
                      src={url}
                      loading="lazy"
                      className={styles["player"]}
                    ></iframe>
                  </div>
                ))}
            </section>
          </Box>
        </Modal>
        <div className={styles["movie-container"] + " page-limit"}>
          <section className={styles["detail-wrapper"]}>
            <Grid className={styles["detail"]} container>
              <Grid item xs={12} sm={12} md={3} lg={3}>
                <div className={styles["movie-poster"]}>
                  <div
                    className={styles["movie"]}
                    style={{
                      backgroundColor:
                        movieDetail.vote_count > 0
                          ? "hsl(" +
                            (
                              (Math.round(movieDetail.vote_average * 10) /
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
                        filter: movieDetail.adult ? "blur(3rem)" : "",
                      }}
                    >
                      {movieDetail.poster_path != null ||
                      movieDetail.backdrop_path != null ? (
                        <Image
                          src={
                            movieDetail.poster_path
                              ? movieDetail.poster_path
                              : movieDetail.backdrop_path
                          }
                          width={100}
                          height={100}
                          alt=""
                          onLoad={handleImageLoad}
                          onError={handleImageError}
                        />
                      ) : (
                        <div className={styles["null-image"]}>No Image</div>
                      )}
                      <div
                        className={styles["movie-rating"]}
                        style={{
                          backgroundColor:
                            movieDetail.vote_count > 0
                              ? "hsl(" +
                                (
                                  (Math.round(movieDetail.vote_average * 10) /
                                    100) *
                                  120
                                ).toString(10) +
                                ", 40%, 50%)"
                              : "rgb(var(--shades-normal))",
                        }}
                      >
                        {movieDetail.vote_count > 0
                          ? Math.round(movieDetail.vote_average * 10) + "%"
                          : "?"}
                      </div>
                    </div>
                  </div>
                </div>
                {movieDetail && (
                  <div className={styles["find-wrapper"]}>
                    <div className={styles["find-youtube"]}>
                      <button
                        onClick={findYoutube}
                        className={styles["show-more"]}
                      >
                        Show Youtube
                        <YouTubeIcon
                          fontSize="medium"
                          sx={{ marginLeft: "0.5rem" }}
                        />
                      </button>
                    </div>
                  </div>
                )}
              </Grid>
              <Grid item xs={12} sm={12} md={9} lg={9}>
                <div className={styles["movie-detail"]}>
                  <div className={styles["title"]}>{movieDetail.title}</div>
                  <div className={styles["others"]}>
                    <div className={styles["genres"]}>
                      {movieDetail &&
                        movieDetail.genres.map((genre: any) => {
                          return (
                            <div
                              key={genre.id}
                              className={styles["genre-wrapper"]}
                            >
                              <div className={styles["genre"]}>
                                {genre.name}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    {movieDetail.release_date && (
                      <div className={styles["release"]}>
                        Released at {movieDetail.release_date}
                      </div>
                    )}
                    {movieDetail.runtime && (
                      <div className={styles["runtime"]}>
                        Movies duration{" "}
                        {movieDetail.runtime >= 60
                          ? Math.floor(movieDetail.runtime / 60) +
                            " hour " +
                            (movieDetail.runtime -
                              Math.floor(movieDetail.runtime / 60) * 60 >
                            0
                              ? movieDetail.runtime -
                                  Math.floor(movieDetail.runtime / 60) * 60 >
                                1
                                ? movieDetail.runtime -
                                  Math.floor(movieDetail.runtime / 60) * 60 +
                                  " minutes"
                                : "1 minute"
                              : "")
                          : "unknown"}
                      </div>
                    )}
                    {movieDetail.revenue && (
                      <div className={styles["revenue"]}>
                        Revenue in {formatter.format(movieDetail.revenue)}
                      </div>
                    )}
                    {movieDetail.budget && (
                      <div className={styles["budget"]}>
                        Budget out {formatter.format(movieDetail.budget)}
                      </div>
                    )}
                  </div>
                  <div className={styles["overview"]}>
                    <div className={styles["title"]}>Overview</div>
                    <div className={styles["text"]}>{movieDetail.overview}</div>
                  </div>
                  <div className={styles["production"]}>
                    <div className={styles["title"]}>Production</div>
                    <Grid container>
                      <Grid item xs={12} sm={6}>
                        <div className={styles["sub-title"]}>Companies</div>
                        {movieDetail &&
                          movieDetail.production_companies.map(
                            (company: any) => (
                              <div
                                key={company.name}
                                className={styles["item"]}
                              >
                                &#9656; {company.name}
                              </div>
                            )
                          )}
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <div className={styles["sub-title"]}>Countries</div>
                        {movieDetail &&
                          movieDetail.production_countries.map(
                            (country: any) => (
                              <div
                                key={country.name}
                                className={styles["item"]}
                              >
                                &#9656; {country.name}
                              </div>
                            )
                          )}
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </Grid>
            </Grid>
          </section>
        </div>
      </section>
    );
  } else {
    return <>Fetching Data</>;
  }
};
export default Movie;
