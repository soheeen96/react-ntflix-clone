const API_KEY = "0f3f52a3db97315bbd6334c10a0718e6";
const BASE_PATH = "https://api.themoviedb.org/3";

// Video
export interface IMovie {
  adult: boolean;
  backdrop_path?: string | null;
  first_air_date?: Date;
  genre_ids?: number[];
  id: number;
  media_type?: MediaType;
  original_language?: string;
  original_name?: string;
  original_title?: string;
  overview?: string;
  popularity: number;
  poster_path?: string;
  release_date?: Date;
  title?: string;
  name?: string;
  origin_country?: string[];
  video?: boolean;
  vote_average?: number;
  vote_count?: number;
  gender?: number;
  known_for?: KnownFor[];
  known_for_department?: string;
  profile_path?: null | string;
  created_by?: any[];
  episode_run_time?: any[];
  genres?: any[];
  homepage?: string;
  in_production?: boolean;
  languages?: any[];
  last_air_date?: Date;
  last_episode_to_air?: LastEpisodeToAir;
  next_episode_to_air?: null;
  networks?: any[];
  number_of_episodes?: number;
  number_of_seasons?: number;
  production_companies?: any[];
  production_countries?: any[];
  seasons?: Season[];
  spoken_languages?: any[];
  status?: string;
  tagline?: string;
  type?: string;
}

// Movie
export interface INowPlayingMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IMoviesResult {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

// Tv
export interface IAirTodayShowResult {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface LastEpisodeToAir {
  air_date: Date;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: null;
  season_number: number;
  show_id: number;
  still_path: null;
  vote_average: number;
  vote_count: number;
}

export interface Season {
  air_date: Date;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: null;
  season_number: number;
}

export interface IPopularShowResult {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface ITopRatedShowResult {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IOnTheAir {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

// Search
export interface ISearchResult {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface KnownFor {
  adult: boolean;
  backdrop_path?: string;
  genre_ids: number[];
  id: number;
  media_type: MediaType;
  original_language: OriginalLanguage;
  original_title: string;
  overview: string;
  poster_path?: string;
  release_date: Date;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export enum MediaType {
  Movie = "movie",
  Person = "person",
  Tv = "tv",
}

export enum OriginalLanguage {
  En = "en",
  Fr = "fr",
  Hu = "hu",
}

// Movie Detail
export interface IMovieDetail {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: BelongsToCollection;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: Date;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface BelongsToCollection {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface ISimilarMovies {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export function getNowPlayingMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getTopRatedMovies() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getPopularMovies() {
  return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getUpcomingMovies() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getAiringTodayShows() {
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getOnTheAirShows() {
  return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getPopularShows() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

export function getTopRatedShows() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getSearchMulti(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/multi?api_key=${API_KEY}&language=en-US&query=${keyword}&page=1&include_adult=true`
  ).then((response) => response.json());
}

export function getSearchMovie(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/movie?api_key=${API_KEY}&language=en-US&query=${keyword}&page=1&include_adult=true`
  ).then((response) => response.json());
}

export function getSearchTv(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/tv?api_key=${API_KEY}&language=en-US&query=${keyword}&page=1&include_adult=true`
  ).then((response) => response.json());
}

export function getMovieDetail(movieId: number) {
  return fetch(
    `${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}&language=en-US`
  ).then((response) => response.json());
}

export function getSimilarMovies(movieId: number) {
  return fetch(
    `${BASE_PATH}/movie/${movieId}/similar?api_key=${API_KEY}&language=en-US&page=1`
  ).then((response) => response.json());
}
