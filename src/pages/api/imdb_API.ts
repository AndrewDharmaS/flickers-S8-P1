import axios from "axios";
const IMDB_API_KEY = "94f626a92a6336d94f7a73961832c05f";
const DEFAULT_API_URL = "https://api.themoviedb.org/3";
const DEFAULT_IMAGE_URL = "https://image.tmdb.org/t/p/original";
const API_URL = "?api_key=" + IMDB_API_KEY;

function PROCESS_MOVIES(data: any) {
  data.result = data.results.forEach((movie: any) => {
    const poster_path = movie.poster_path;
    if (poster_path !== null) {
      movie.poster_path = DEFAULT_IMAGE_URL + poster_path;
    }
    const backdrop_path = movie.backdrop_path;
    if (backdrop_path !== null) {
      movie.backdrop_path = DEFAULT_IMAGE_URL + backdrop_path;
    }
  });
  return data;
}
function PROCESS_MOVIE_DETAIL(data: any) {
  const poster_path = data.poster_path;
  if (poster_path !== null) {
    data.poster_path = DEFAULT_IMAGE_URL + poster_path;
  }
  const backdrop_path = data.backdrop_path;
  if (backdrop_path !== null) {
    data.backdrop_path = DEFAULT_IMAGE_URL + backdrop_path;
  }
  data.production_companies.forEach((company: any) => {
    const logo_path = company.logo_path;
    if (logo_path !== null) {
      company.logo_path = DEFAULT_IMAGE_URL + logo_path;
    }
  });
  return data;
}
function PROCESS_PERSON_DETAIL(data: any) {
  const profile_path = data.profile_path;
  if (profile_path !== null) {
    data.profile_path = DEFAULT_IMAGE_URL + profile_path;
  }
  return data;
}
function PROCESS_PERSON_CREDIT(data: any) {
  data.cast = data.cast.filter((cast: any) => cast.adult === false);
  data.cast = data.cast.map(({ original_title, id, character }: any) => ({
    original_title,
    id,
    character,
  }));
  // FILTER ADULT
  data.crew = data.crew.filter((crew: any) => crew.adult === false);
  data.crew = data.crew.map(({ original_title, job, department }: any) => ({
    original_title,
    job,
    department,
  }));
  // FILTER ADULT
  return data;
}
function PROCESS_PERSON(data: any) {
  data.result = data.results.forEach((person: any) => {
    const profile_path = person.profile_path;
    if (profile_path !== null) {
      person.profile_path = DEFAULT_IMAGE_URL + profile_path;
    }
  });
  return data;
}
const getAllGenres = async function getAllGenres(): Promise<any> {
  const url = DEFAULT_API_URL + "/genre/movie/list" + API_URL;
  const { data: res } = await axios.get(url);
  return res as any;
};
const getTrendingMovieWeek =
  async function getTrendingMovieWeek(): Promise<any> {
    const url = DEFAULT_API_URL + "/trending/movie/week" + API_URL + "&page=1";
    const { data: res } = await axios.get(url);
    const processed = PROCESS_MOVIES(res);
    return processed as any;
  };
const getTrendingPersonWeek =
  async function getTrendingPersonWeek(): Promise<any> {
    const url = DEFAULT_API_URL + "/trending/person/week" + API_URL + "&page=1";
    const { data: res } = await axios.get(url);
    const processed = PROCESS_PERSON(res);
    return processed as any;
  };
const getMovieDetail = async function getMovieDetail(id: any): Promise<any> {
  const url = DEFAULT_API_URL + "/movie/" + id + API_URL;
  const { data: res } = await axios.get(url);
  const processed = PROCESS_MOVIE_DETAIL(res);
  return processed as any;
};
const getPersonDetail = async function getPersonDetail(id: any): Promise<any> {
  const url = DEFAULT_API_URL + "/person/" + id + API_URL;
  const { data: res } = await axios.get(url);
  const processed = PROCESS_PERSON_DETAIL(res);
  return processed as any;
};
const getPersonCredit = async function getPersonCredit(id: any): Promise<any> {
  const url =
    DEFAULT_API_URL +
    "/person/" +
    id +
    "/movie_credits" +
    API_URL +
    "&language=en-US";
  const { data: res } = await axios.get(url);
  const processed = PROCESS_PERSON_CREDIT(res);
  return processed as any;
};
const searchMovies = async function searchMovies(
  query: string,
  adult: boolean,
  page: number
): Promise<any> {
  let url = DEFAULT_API_URL;
  if (query == "") {
    url =
      url +
      "/discover/movie" +
      API_URL +
      "&sort_by=popularity.desc" +
      "&include_adult=" +
      adult +
      "&include_video=false&page=" +
      page;
  } else {
    url =
      url +
      "/search/movie" +
      API_URL +
      "&query=" +
      query +
      "&include_adult=" +
      adult +
      "&page=" +
      page;
  }
  const { data: res } = await axios.get(url);
  const processed = PROCESS_MOVIES(res);
  return processed as any;
};
const searchPersons = async function searchPersons(
  query: string,
  adult: boolean,
  page: number
): Promise<any> {
  let url = DEFAULT_API_URL;
  if (query == "") {
    url =
      url +
      "/person/popular" +
      API_URL +
      "&sort_by=popularity.desc" +
      "&include_adult=" +
      adult +
      "&page=" +
      page;
  } else {
    url =
      url +
      "/search/person" +
      API_URL +
      "&query=" +
      query +
      "&include_adult=" +
      adult +
      "&page=" +
      page;
  }
  const { data: res } = await axios.get(url);
  // console.log(res);
  const processed = PROCESS_PERSON(res);
  return processed as any;
};
export default {
  getAllGenres,
  getTrendingMovieWeek,
  getTrendingPersonWeek,
  getMovieDetail,
  getPersonDetail,
  getPersonCredit,
  searchMovies,
  searchPersons,
};
