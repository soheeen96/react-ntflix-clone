import { atom } from "recoil";
import { IMovie } from "./api";

export const clickedMovieState = atom<IMovie | null>({
  key: "clickedMovie",
  default: null,
});

export const clickedTvState = atom<IMovie | null>({
  key: "clickedTv",
  default: null,
});

export const clickedSearchState = atom<IMovie | null>({
  key: "clickedSearch",
  default: null,
});
