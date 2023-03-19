import { AnimatePresence, useScroll } from "framer-motion";
import { useQuery } from "react-query";
import { useMatch, useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import {
  getSearchMovie,
  getSearchMulti,
  getSearchTv,
  ISearchResult,
} from "../api";
import { clickedSearchState } from "../atoms";
import Slider from "../Components/Sliders";
import { makeImagePath } from "../utils";
import {
  BigCover,
  BigMovie,
  BigOverview,
  BigTitle,
  Loader,
  Overlay,
  Sliders,
  Wrapper,
} from "./Home";

function Search() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");

  const navigate = useNavigate();
  const bigVideoMatch = useMatch("/search/:movieId");
  const { scrollY } = useScroll();

  const [clickedSearch] = useRecoilState(clickedSearchState);

  const { data: searchMultiData, isLoading: searchMultiLoading } =
    useQuery<ISearchResult>(["search", "multi", keyword], () =>
      getSearchMulti(keyword!)
    );
  const { data: searchMovieData, isLoading: searchMovieLoading } =
    useQuery<ISearchResult>(["search", "movie", keyword], () =>
      getSearchMovie(keyword!)
    );
  const { data: searchTvData, isLoading: searchTvLoading } =
    useQuery<ISearchResult>(["search", "tv", keyword], () =>
      getSearchTv(keyword!)
    );

  const onOverlayClick = () => navigate(-1);

  return (
    <Wrapper>
      {searchMultiLoading || searchMovieLoading || searchTvLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <div style={{ width: 100, height: 300 }}></div>
          <Sliders>
            <Slider
              title="MOVIE"
              sliderId="search-movie"
              mediaType="search-movie"
              contents={searchMovieData ? searchMovieData?.results : []}
            ></Slider>
            <Slider
              title="TV"
              sliderId="search-tv"
              mediaType="search-tv"
              contents={searchTvData ? searchTvData?.results : []}
            ></Slider>
          </Sliders>

          <AnimatePresence>
            {bigVideoMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                ></Overlay>
                <BigMovie
                  style={{ top: scrollY.get() + 30 }}
                  layoutId={bigVideoMatch?.params.movieId}
                >
                  {clickedSearch && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top,#181818 , transparent), url(${makeImagePath(
                            clickedSearch.backdrop_path!
                          )})`,
                        }}
                      />
                      <BigTitle>
                        {clickedSearch.title
                          ? clickedSearch.title
                          : clickedSearch.name}
                      </BigTitle>
                      <BigOverview>{clickedSearch.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Search;
