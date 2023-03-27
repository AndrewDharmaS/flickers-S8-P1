import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { NextPage } from "next";
import imdbAPI from "./api/imdb_API";
import styles from "@/styles/Persons.module.css";
import { Grid, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Image from "next/image";
import EighteenUpRatingOutlinedIcon from "@mui/icons-material/EighteenUpRatingOutlined";
import RecentActorsRoundedIcon from "@mui/icons-material/RecentActorsRounded";

const Person: NextPage = () => {
  const [personData, setPersonData] = useState<any>();
  const [query, setQuery] = useState("");
  const [lastQuery, setLastQuery] = useState("");
  const [adult, setAdult] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    console.log("Image failed to load");
  };
  const handleSearch = async (e: any) => {
    e.preventDefault();
    const newData: any = await imdbAPI.searchPersons(query, adult, page);
    setLastQuery(query);
    setPersonData(newData);
    setTotalPages(newData.total_pages);
    setTotalResults(newData.total_results);
    setPage(1);
  };

  const loadMore = async () => {
    const newData: any = await imdbAPI.searchPersons(
      lastQuery,
      adult,
      page + 1
    );
    // console.log(newData);
    const sendPerson = personData;
    sendPerson.results = [...personData.results, ...newData.results];
    setPersonData(sendPerson);
    setPage(page + 1);
  };

  useEffect(() => {
    const getPersonWeeks = async () => {
      const data: any = await imdbAPI.searchPersons(query, adult, page);
      // console.log(data);
      setTotalPages(data.total_pages);
      setTotalResults(data.total_results);
      setPersonData(data);
    };
    getPersonWeeks();
  }, []);
  if (personData) {
    return (
      <section className={styles["persons-page"]}>
        <div className={styles["persons-container"] + " page-limit"}>
          <section className={styles["search-wrapper"]}>
            <div className={styles["search-feedback"]}>
              {query == "" ? (
                <span>Tell me, who is it that you seek?</span>
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
              {personData &&
                personData.results.map((person: any) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={person.id + page}
                    padding={2}
                  >
                    <Link href={"/persons/" + person.id}>
                      <div key={person.id} className={styles["person-wrapper"]}>
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
                              {person.known_for.map((show: any) => (
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
                <RecentActorsRoundedIcon
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
export default Person;
