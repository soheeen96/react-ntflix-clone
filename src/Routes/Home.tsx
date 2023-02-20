import { useQuery } from "@tanstack/react-query";

import styled from "styled-components";

import {
  getPopularMovies,
  getNowMovies,
  getTopMovies,
  getUpcomingMovies,
  IGetMoviesResult,
} from "../api";
import Sliders from "../Components/Sliders";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background: ${(props) => props.theme.black.veryDark};
  overflow: hidden;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background: linear-gradient(rgba(0, 0, 0, 0), rgba(20, 20, 20, 1)),
    url(${(props) => props.bgphoto}) no-repeat center / cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px; ;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const SliderWrap = styled.div`
  margin: -100px auto 0;
  width: 100%;
  padding: 0 60px;
  position: relative;
`;

function Home() {
  const { data: popularData, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "popular"],
    getPopularMovies
  );
  const { data: nowData } = useQuery<IGetMoviesResult>(
    ["movies", "now"],
    getNowMovies
  );
  const { data: topRatedData } = useQuery<IGetMoviesResult>(
    ["movies", "top"],
    getTopMovies
  );
  const { data: upComingData } = useQuery<IGetMoviesResult>(
    ["movies", "upcoming"],
    getUpcomingMovies
  );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>loading...</Loader>
      ) : (
        <>
          {/* backdrop_path || "" >> backdrop_path 없을 경우 빈 string 보여주기 */}
          <Banner
            bgphoto={makeImagePath(popularData?.results[0].backdrop_path || "")}
          >
            <Title>{popularData?.results[0].title}</Title>
            <Overview>{popularData?.results[0].overview}</Overview>
          </Banner>
          <SliderWrap>
            <Sliders
              page="movies"
              title="Now Playing"
              category="now"
              data={nowData}
            />
            <Sliders
              page="movies"
              title="Top-Rated"
              category="top"
              data={topRatedData}
            />
            <Sliders
              page="movies"
              title="Coming Soon"
              category="upcoming"
              data={upComingData}
            />
          </SliderWrap>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
