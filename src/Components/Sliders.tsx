import styled from "styled-components";
import { useNavigate, useMatch, PathMatch } from "react-router-dom";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { makeImagePath } from "../utils";
import { IGetMoviesResult } from "../api";
import { useQuery } from "@tanstack/react-query";

const Slider = styled.div`
  position: relative;
  margin-bottom: 80px;
`;

const SliderTitle = styled.h2`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 15px;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
  height: 200px;
`;

const Btn = styled.button`
  width: 40px;
  height: 40px;
  position: absolute;
  top: 50%;
  left: -40px;
  transform: translate(-50%, -50%);
  color: ${(props) => props.theme.white.lighter};
  background: none;
  border: 0;
  font-size: 22px;
  cursor: pointer;
  &:last-child {
    left: auto;
    right: -40px;
    transform: translate(50%, -50%);
  }
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background: url(${(props) => props.bgphoto}) no-repeat center / cover;
  height: 100%;
  position: relative;
  cursor: pointer;

  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.veryDark};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  transform: translateY(100%);
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 20;
`;

const BigMovie = styled(motion.div)<{ scrolly: number }>`
  position: fixed;
  width: min(600px, 40vw);
  height: 80vh;
  top: 10vh;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.darker};
  z-index: 30;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
  display: flex;
  flex-flow: row wrap;
  align-items: flex-end;
  h3 {
    padding: min(20px, 4%);
    font-size: 36px;
    font-weight: 700;
    color: ${(props) => props.theme.white.lighter};
  }
`;

const BigOverview = styled.div`
  padding: min(20px, 4%);
  font-size: 18px;
  color: ${(props) => props.theme.white.lighter};
`;

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    zIndex: 4,
    boxShadow: "0 5px 10px 3px #00000080",
    transition: {
      delay: 0.4,
      duaration: 0.3,
      type: "tween",
    },
  },
};
const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const rowVariants = {
  hidden: (reverse: number) => ({
    x: reverse > 0 ? -window.outerWidth : window.outerWidth,
  }),
  visible: { x: 0 },
  exit: (reverse: number) => ({
    x: reverse > 0 ? window.outerWidth : -window.outerWidth,
  }),
};

interface ISliders {
  page: string;
  title: string;
  category: string;
  data: IGetMoviesResult | undefined;
}

const offset = 6;

function Sliders({ page, title, category, data }: ISliders) {
  //슬라이드 클릭하면 url 개별id로 변경
  const navigate = useNavigate();
  const onBoxClicked = (movieId: number) => {
    navigate(`/${page}/${movieId}`);
  };

  //슬라이드 버튼
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [reverse, setReverse] = useState(0);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const decreaseIndex = () => {
    setReverse(1);
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const increaseIndex = () => {
    setReverse(-1);
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const { scrollY } = useScroll();

  const bigMovieMatch: PathMatch<string> | null = useMatch(`/${page}/:id`);

  const clickedMovie =
    bigMovieMatch?.params.id &&
    data?.results.find((movie) => movie.id + "" === bigMovieMatch.params.id);

  console.log(clickedMovie);

  //오버레이 영역 클릭하면 뒤로가기
  const onOverlayClick = () => navigate(-1);
  return (
    <>
      <Slider>
        <Btn onClick={decreaseIndex}>&lt;</Btn>

        <AnimatePresence
          initial={false}
          onExitComplete={toggleLeaving}
          custom={reverse}
        >
          <SliderTitle>{title}</SliderTitle>
          <Row
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 1 }}
            key={index}
            custom={reverse}
          >
            {data?.results
              .slice(1)
              .slice(offset * index, offset * index + offset)
              .map((movie) => (
                <Box
                  layoutId={category + movie.id + ""}
                  key={movie.id}
                  variants={boxVariants}
                  whileHover="hover"
                  initial="normal"
                  transition={{ type: "tween" }}
                  onClick={() => onBoxClicked(movie.id)}
                  bgphoto={makeImagePath(
                    movie.backdrop_path || movie.poster_path,
                    "w500"
                  )}
                >
                  <Info variants={infoVariants}>
                    <h4>{movie.title}</h4>
                  </Info>
                </Box>
              ))}
          </Row>
        </AnimatePresence>
        <Btn onClick={increaseIndex}>&gt;</Btn>
      </Slider>
      <AnimatePresence>
        {bigMovieMatch ? (
          <>
            <Overlay
              onClick={onOverlayClick}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />

            <BigMovie
              scrolly={scrollY.get()}
              layoutId={bigMovieMatch.params.id}
            >
              {clickedMovie && (
                <>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(to top, #181818, transparent), url(${makeImagePath(
                        clickedMovie.backdrop_path,
                        "w500"
                      )})`,
                    }}
                  >
                    <h3>{clickedMovie.title}</h3>
                  </BigCover>

                  <BigOverview>
                    <div>
                      <h4>{clickedMovie.release_date}</h4>
                      <h4>{clickedMovie.vote_average}</h4>
                    </div>
                    <p>{clickedMovie.overview}</p>
                  </BigOverview>
                </>
              )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
export default Sliders;
