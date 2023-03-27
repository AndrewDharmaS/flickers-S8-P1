import { NextPage } from "next";
import { useRouter } from "next/router";
import imdbAPI from "../api/imdb_API";
import twitterAPI from "../api/twitter_API";
import Image from "next/image";
import styles from "@/styles/Person.module.css";
import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import TwitterIcon from "@mui/icons-material/Twitter";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Link from "next/link";
import axios from "axios";
const Person: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [personDetail, setPersonDetail] = useState<any>();
  const [personCredit, setPersonCredit] = useState<any>();
  const [twitterData, setTwitterData] = useState<any>(["None"]);
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

  const findTwitter = async () => {
    if (once) {
      const data: any = await axios.get(
        `/api/twitter_API?query=${encodeURIComponent(personDetail.name)}`
      );
      setTwitterData(data.data);
      console.log(data.data);
      setOnce(false);
    }
    // console.log(twitterData);
    setOpen(true);
  };

  useEffect(() => {
    const getPersonDetail = async () => {
      const data: any = await imdbAPI.getPersonDetail(id);
      // console.log(data);
      setPersonDetail(data);
    };
    const getPersonCredit = async () => {
      const data: any = await imdbAPI.getPersonCredit(id);
      // console.log(data);
      setPersonCredit(data);
    };
    getPersonDetail();
    getPersonCredit();
  }, [id]);
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  if (personDetail && personCredit) {
    return (
      <section className={styles["person-page"]}>
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
            <section className={styles["tweet-wrapper"]}>
              <Grid container spacing={2}>
                {twitterData &&
                  twitterData.map((tweet: any) => (
                    <Grid key={tweet.id} item sm={12} md={4}>
                      <div className={styles["tweet"]}>
                        <div className={styles["text"]}>{tweet.text}</div>
                      </div>
                    </Grid>
                  ))}
              </Grid>
            </section>
          </Box>
        </Modal>
        <div className={styles["person-container"] + " page-limit"}>
          <section className={styles["detail-wrapper"]}>
            <Grid className={styles["detail"]} container>
              <Grid item xs={12} sm={12} md={3} lg={3}>
                <div className={styles["person-poster"]}>
                  <div
                    className={styles["person"]}
                    style={{
                      backgroundColor:
                        personDetail.vote_count > 0
                          ? "hsl(" +
                            (
                              (Math.round(personDetail.vote_average * 10) /
                                100) *
                              120
                            ).toString(10) +
                            ", 40%, 50%)"
                          : "rgb(var(--shades-normal))",
                    }}
                  >
                    <div className={styles["person-image"]}>
                      {personDetail.profile_path && (
                        <Image
                          src={personDetail.profile_path}
                          width={100}
                          height={100}
                          alt=""
                          onLoad={handleImageLoad}
                          onError={handleImageError}
                        />
                      )}
                    </div>
                  </div>
                </div>
                {personDetail && (
                  <div className={styles["find-wrapper"]}>
                    <div className={styles["find-youtube"]}>
                      <button
                        onClick={findTwitter}
                        className={styles["show-more"]}
                      >
                        Show Twitter Comment
                        <TwitterIcon
                          fontSize="medium"
                          sx={{ marginLeft: "0.5rem" }}
                        />
                      </button>
                    </div>
                  </div>
                )}
              </Grid>
              <Grid item xs={12} sm={12} md={9} lg={9}>
                <div className={styles["person-detail"]}>
                  <div className={styles["title"]}>{personDetail.name}</div>
                  <div className={styles["others"]}>
                    <div className={styles["genres"]}>
                      {personDetail &&
                        personDetail.also_known_as.map((nickname: any) => {
                          return (
                            <div
                              key={nickname}
                              className={styles["genre-wrapper"]}
                            >
                              <div className={styles["genre"]}>{nickname}</div>
                            </div>
                          );
                        })}
                    </div>
                    {personDetail.budget && (
                      <div className={styles["budget"]}>
                        Department {personDetail.knowns_for_department}
                      </div>
                    )}
                    {personDetail.budget && (
                      <div className={styles["budget"]}>
                        Gender {personDetail.gender}
                      </div>
                    )}
                    {personDetail.birthday && (
                      <div className={styles["release"]}>
                        Birthday {personDetail.birthday}
                      </div>
                    )}
                    {personDetail.revenue && (
                      <div className={styles["revenue"]}>
                        Place of Birth {personDetail.place_of_birth}
                      </div>
                    )}
                  </div>
                  <div className={styles["overview"]}>
                    <div className={styles["title"]}>Overview</div>
                    <div className={styles["text"]}>
                      {personDetail.biography}
                    </div>
                  </div>
                  <div className={styles["production"]}>
                    <div className={styles["title"]}>Credits</div>
                    <Grid container>
                      {personCredit && personCredit.cast && (
                        <Grid item xs={12} sm={6}>
                          <div className={styles["sub-title"]}>As Cast</div>
                          {personCredit &&
                            personCredit.cast.map((cast: any) => (
                              <div key={cast.id}>
                                {cast.original_title && (
                                  <div className={styles["item"]}>
                                    <Link href={"/movies/" + cast.id}>
                                      &#9656; {cast.original_title}{" "}
                                      {cast.character && (
                                        <>as {cast.character}</>
                                      )}
                                    </Link>
                                  </div>
                                )}
                              </div>
                            ))}
                        </Grid>
                      )}
                      {personCredit && personCredit.crew && (
                        <Grid item xs={12} sm={6}>
                          <div className={styles["sub-title"]}>As Crew</div>
                          {personCredit &&
                            personCredit.crew.map((crew: any) => (
                              <div key={crew.id}>
                                {crew.original_title && (
                                  <div className={styles["item"]}>
                                    &#9656; {crew.original_title} as {crew.job}{" "}
                                    in {crew.department}
                                  </div>
                                )}
                              </div>
                            ))}
                        </Grid>
                      )}
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
export default Person;
