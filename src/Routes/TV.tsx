import { useQuery } from "@tanstack/react-query";

import styled from "styled-components";

import {
  IGetMoviesResult,
  getPopularTv,
  getLatestTv,
  getAirTv,
  getTopTv,
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

function Tv() {
  const { data: popularData, isLoading } = useQuery<IGetMoviesResult>(
    ["tv", "popular"],
    getPopularTv
  );
  const { data: latestData } = useQuery<IGetMoviesResult>(
    ["tv", "latest"],
    getLatestTv
  );
  const { data: airData } = useQuery<IGetMoviesResult>(["tv", "air"], getAirTv);
  const { data: topData } = useQuery<IGetMoviesResult>(["tv", "top"], getTopTv);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>loading...</Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(popularData?.results[0].backdrop_path || "")}
          >
            <Title>{popularData?.results[0].title}</Title>
            <Overview>{popularData?.results[0].overview}</Overview>
          </Banner>
          <SliderWrap>
            <Sliders
              page="tv"
              title="Airing Today"
              category="air"
              data={airData}
            />
            <Sliders
              page="tv"
              title="Latest Shows"
              category="popular"
              data={popularData}
            />
            <Sliders
              page="tv"
              title="Top Rated"
              category="top"
              data={topData}
            />
          </SliderWrap>
        </>
      )}
    </Wrapper>
  );
}
export default Tv;
