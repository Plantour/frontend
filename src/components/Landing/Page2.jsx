import landing_pg2_2_freepik from "../../assets/landing_pg2_2_freepik.jpg";
import landing_pg2_3_freepik from "../../assets/landing_pg2_3_freepik.jpg";

import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { translations } from "../../list/translations";
import { useLanguage } from "../../helpers/languageUtils";

const GridContainer = styled.div`
  width: 90%;
  height: 90%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  overflow: hidden;
  border-radius: 10px;
  position: relative;
`;

const GridItem = styled.div`
  background-image: ${(props) => `url(${props.image})`};
  background-size: 300% 300%;
  background-position: ${(props) => props.position};
  filter: ${(props) => (props.isColored ? "none" : "grayscale(100%)")};
  transition: filter 0.5s ease;

  &:nth-child(1) {
    border-top-left-radius: 10px;
  }
  &:nth-child(3) {
    border-top-right-radius: 10px;
  }
  &:nth-child(7) {
    border-bottom-left-radius: 10px;
  }
  &:nth-child(9) {
    border-bottom-right-radius: 10px;
  }
`;

const clickAnimation = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(0.9); opacity: 1; }
`;

const Cursor = styled.div`
  width: 20px;
  height: 20px;
  background-color: transparent;
  border: 2px solid white;
  border-radius: 50%;
  position: absolute;
  transition: all 0.5s ease;
  pointer-events: none;
  z-index: 10;
  left: ${(props) => props.x}px;
  top: ${(props) => props.y}px;

  &::after {
    content: "";
    display: ${(props) => (props.clicking ? "block" : "none")};
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    animation: ${clickAnimation} 0.3s ease-in-out;
  }
`;

const Page2Layout = styled.div`
  width: 100%;
  height: 60%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 10px;
  gap: 5px;
`;

const IllustContainer = styled.div`
  width: 100%;
  height: 70%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Attribution = styled.div`
  width: 90%;
  text-align: right;
  font-size: 0.675rem;
  color: grey;
`;

const TextContainer = styled.div`
  height: 110px;
`;

const Title = styled.h1`
  font-size: 1rem;
`;

const Desc = styled.p`
  font-size: 0.875rem;
`;

const Page2 = () => {
  const [coloredSections, setColoredSections] = useState(Array(9).fill(false));
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [clicking, setClicking] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const { translations } = useLanguage();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % 9);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const gridItems = containerRef.current.querySelectorAll(".grid-item");
      const item = gridItems[currentIndex];
      const rect = item.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      setCursorPos({
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top + rect.height / 2,
      });

      const clickTimeout = setTimeout(() => {
        setClicking(true);
        setTimeout(() => {
          setClicking(false);
          setColoredSections((prev) => {
            const newState = [...prev];
            newState[currentIndex] = true;
            return newState;
          });
        }, 150);
      }, 1000);

      return () => clearTimeout(clickTimeout);
    }
  }, [currentIndex]);

  // currentIndex가 0일 때 모든 그리드를 다시 흑백으로 초기화
  useEffect(() => {
    if (currentIndex === 0) {
      setColoredSections(Array(9).fill(false));
    }
  }, [currentIndex]);

  const getPosition = (index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return `${col * 50}% ${row * 50}%`;
  };

  return (
    <Page2Layout>
      <IllustContainer>
        <GridContainer ref={containerRef}>
          {coloredSections.map((isColored, index) => (
            <GridItem
              key={index}
              className="grid-item"
              image={landing_pg2_3_freepik}
              position={getPosition(index)}
              isColored={isColored}
            />
          ))}
          <Cursor x={cursorPos.x} y={cursorPos.y} clicking={clicking} />
        </GridContainer>
        <Attribution>designed by Freepik</Attribution>
      </IllustContainer>
      <TextContainer>
        <Title>{translations.page2.title}</Title>
        <Desc>{translations.page2.desc}</Desc>
      </TextContainer>
    </Page2Layout>
  );
};

export default Page2;
