import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import {
  getNowPlayingMovies,
  getTopRatedMovies,
  INowPlayingMoviesResult,
  IMoviesResult,
  getPopularMovies,
  getUpcomingMovies,
  IMovieDetail,
  getMovieDetail,
} from "../api";
import { clickedMovieState } from "../atoms";
import Slider from "../Components/Sliders";
import { makeImagePath } from "../utils";

export const Wrapper = styled.div`
  height: 20vh;
  background-color: ${(props) => props.theme.black.veryDark};
`;

export const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  padding: min(4%, 60px);
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-image: linear-gradient(
      rgba(0, 0, 0, 0),
      ${(props) => props.theme.black.veryDark}
    ),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 48px;
  font-weight: 700;
  margin: 15% 0 30px;
`;

const Overview = styled.p`
  font-size: 28px;
  width: 50%;
`;

export const Sliders = styled.div`
  box-sizing: border-box;
  margin: 3vw 0;
  position: relative;
  top: -130px;
  display: flex;
  flex-flow: column wrap;
  padding: 0 min(4%, 60px);
`;

export const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

export const BigMovie = styled(motion.div)`
  position: absolute;
  border-radius: 5px;
  width: min(960px, 70vw);
  height: 80vh;
  top: 10vh;
  right: 0;
  left: 0;
  margin: 0 auto;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.darker};
`;

export const BigCover = styled.div`
  width: 100%;
  padding-bottom: 56%;
  background-size: cover;
  background-position: center center;
`;

export const DetailContainer = styled.div`
  position: relative;
  top: -15%;
  margin: 0 30px;
`;

export const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 20px;
`;

export const VoteAverage = styled.div`
  font-size: 24px;
  font-weight: 400;
`;

export const InfoWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
`;

export const MainInfo = styled.div``;

export const Release = styled.p`
  width: 30%;
  font-size: 20px;
  font-weight: 500;
  span {
    margin-right: 10px;
    border-radius: 5px;
    padding: 5px 15px;
    background-color: ${(props) => props.theme.white.darker};
    color: ${(props) => props.theme.black.lighter};
  }
`;

export const SubInfo = styled.div``;

export const Genres = styled.ul`
  width: 65%;
  display: flex;
`;

export const Genre = styled.li`
  padding: 5px 10px;
  border-radius: 5px;
  margin-right: 10px;
  background-color: red;
  font-size: 20px;
  font-weight: 400;
  display: flex;
`;

export const BigOverview = styled.p`
  margin-top: 20px;
  width: 100%;
  font-size: 18px;
  color: ${(props) => props.theme.white.lighter};
`;

function Home() {
  const navigate = useNavigate();
  const bigVideoMatch = useMatch("/movies/:movieId");
  const clickedVideoId = bigVideoMatch ? +bigVideoMatch.params.movieId! : null;
  //console.log(clickedVideoId);
  const { scrollY } = useScroll();

  const [clickedMovie] = useRecoilState(clickedMovieState);

  const { data: nowPlayingData, isLoading: nowPlayingLoading } =
    useQuery<INowPlayingMoviesResult>(
      ["movies", "nowPlaying"],
      getNowPlayingMovies
    );
  // console.log(nowPlayingData);

  const { data: topRatedData, isLoading: topRatedLoading } =
    useQuery<IMoviesResult>(["movies", "topRated"], getTopRatedMovies);

  const { data: popularData, isLoading: popularLoading } =
    useQuery<IMoviesResult>(["movies", "popular"], getPopularMovies);

  const { data: upcomingData, isLoading: upcomingLoading } =
    useQuery<IMoviesResult>(["movies", "upcoming"], getUpcomingMovies);
  //console.log("up", upcomingData);
  const { data: movieDetail, isLoading: movieDetailLoading } =
    useQuery<IMovieDetail>(["movie-detail", clickedVideoId], () =>
      getMovieDetail(clickedVideoId!)
    );

  const onOverlayClick = () => navigate(-1);
  return (
    <Wrapper>
      {nowPlayingLoading ||
      topRatedLoading ||
      popularLoading ||
      upcomingLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(
              nowPlayingData?.results[0].backdrop_path || ""
            )}
          >
            <Title>{nowPlayingData?.results[0].title}</Title>
            <Overview>{nowPlayingData?.results[0].overview}</Overview>
          </Banner>
          <Sliders>
            <Slider
              title="NOW PLAYING"
              sliderId="now-playing"
              mediaType="movie"
              contents={nowPlayingData ? nowPlayingData?.results.slice(1) : []}
            ></Slider>
            <Slider
              title="TOP RATED"
              sliderId="top-rated"
              mediaType="movie"
              contents={topRatedData ? topRatedData?.results : []}
            ></Slider>
            <Slider
              title="POPULAR"
              sliderId="popular"
              mediaType="movie"
              contents={popularData ? popularData?.results : []}
            ></Slider>
            <Slider
              title="UPCOMING"
              sliderId="upcoming"
              mediaType="movie"
              contents={upcomingData ? upcomingData?.results : []}
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
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top,#181818 , transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path!
                          )})`,
                        }}
                      />
                      <DetailContainer>
                        <BigTitle>{clickedMovie.title}</BigTitle>
                        <VoteAverage>
                          Rates : {movieDetail?.vote_average.toFixed(1)} / 10
                        </VoteAverage>
                        <InfoWrapper>
                          <MainInfo>
                            <Release>
                              <span>
                                {movieDetail?.release_date
                                  .toString()
                                  .substring(0, 4)}
                              </span>
                              <span>
                                {movieDetail?.runtime
                                  ? Math.floor(movieDetail?.runtime / 60)
                                  : null}
                                h
                                {movieDetail?.runtime
                                  ? Math.floor(movieDetail?.runtime % 60)
                                  : null}
                                m
                              </span>
                            </Release>
                          </MainInfo>
                          <SubInfo>
                            <Genres>
                              {movieDetail?.genres &&
                                movieDetail.genres.map((genre) => (
                                  <Genre key={genre.id}>
                                    <span>{genre.name}</span>
                                  </Genre>
                                ))}
                            </Genres>
                          </SubInfo>
                          <BigOverview>{clickedMovie.overview}</BigOverview>
                        </InfoWrapper>
                      </DetailContainer>
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

export default Home;
