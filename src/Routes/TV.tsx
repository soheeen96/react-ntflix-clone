import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import {
  getAiringTodayShows,
  IAirTodayShowResult,
  getPopularShows,
  getTopRatedShows,
  ITopRatedShowResult,
  IPopularShowResult,
  getOnTheAirShows,
  IOnTheAir,
} from "../api";
import { clickedTvState } from "../atoms";
import Slider from "../Components/Sliders";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  height: 250vh;
  background-color: ${(props) => props.theme.black.veryDark};
`;

const Loader = styled.div`
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

const Sliders = styled.div`
  box-sizing: border-box;
  margin: 3vw 0;
  position: relative;
  top: -130px;
  display: flex;
  flex-flow: column wrap;
  padding: 0 min(4%, 60px);
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
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

const BigCover = styled.div`
  width: 100%;
  padding-bottom: 56%;
  background-size: cover;
  background-position: center center;
`;

const BigTitle = styled.h3`
  padding: 0 20px;
  color: ${(props) => props.theme.white.lighter};
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 20px;
`;

const BigOverview = styled.p`
  padding: 0 20px;
  margin-top: 20px;
  width: 100%;
  font-size: 18px;
  color: ${(props) => props.theme.white.lighter};
`;

function Tv() {
  const navigate = useNavigate();
  const bigVideoMatch = useMatch("/tv/:showId");
  const { scrollY } = useScroll();

  const [clickedTv] = useRecoilState(clickedTvState);

  const { data: airTodayData, isLoading: airTodayLoading } =
    useQuery<IAirTodayShowResult>(["shows", "airToday"], getAiringTodayShows);

  const { data: onTheAirData, isLoading: onTheAirLoading } =
    useQuery<IOnTheAir>(["shows", "onTheAir"], getOnTheAirShows);

  const { data: popularData, isLoading: popularLoading } =
    useQuery<IPopularShowResult>(["movies", "popular"], getPopularShows);

  const { data: topRatedData, isLoading: topRatedLoading } =
    useQuery<ITopRatedShowResult>(["movies", "upcoming"], getTopRatedShows);

  const onOverlayClick = () => navigate(-1);

  return (
    <Wrapper>
      {airTodayLoading ||
      onTheAirLoading ||
      popularLoading ||
      topRatedLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(
              airTodayData?.results[0].backdrop_path || ""
            )}
          >
            <Title>{airTodayData?.results[0].name}</Title>
            <Overview>{airTodayData?.results[0].overview}</Overview>
          </Banner>
          <Sliders>
            <Slider
              title="AIRING TODAY"
              sliderId="airing-today"
              mediaType="tv"
              contents={airTodayData ? airTodayData?.results.slice(1) : []}
            ></Slider>
            <Slider
              title="POPULAR"
              sliderId="popular"
              mediaType="tv"
              contents={popularData ? popularData?.results : []}
            ></Slider>
            <Slider
              title="TOP RATED"
              sliderId="top-rated"
              mediaType="tv"
              contents={topRatedData ? topRatedData?.results : []}
            ></Slider>
            <Slider
              title="ON THE AIR"
              sliderId="on-the-air"
              mediaType="tv"
              contents={onTheAirData ? onTheAirData?.results : []}
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
                  layoutId={bigVideoMatch?.params + ""}
                >
                  {clickedTv && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top,#181818 , transparent), url(${makeImagePath(
                            clickedTv.backdrop_path!
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedTv.name}</BigTitle>
                      <BigOverview>{clickedTv.overview}</BigOverview>
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

export default Tv;
