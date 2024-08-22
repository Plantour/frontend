import React from "react";
import styled, { keyframes } from "styled-components";
import { translations } from "../../list/translations";
import { useLanguage } from "../../helpers/languageUtils";

const fadeInDown = keyframes`
  0% {
    opacity: 0;
    transform: translate(-50%, -100px);
  }
  60% {
    transform: translate(-50%, -40%);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
`;

const fadeInDownMarker = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-50px);
  }
  60% {
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const scaleShadow = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  60% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
`;

const Page1Layout = styled.div`
  width: 100%;
  height: 60%;
  display: flex;
  flex-direction: column;
  justify-content: end;
  padding-bottom: 10px;
  gap: 5px;
`;

const IllustContainer = styled.div`
  width: 100%;
  height: 70%;
  position: relative;
`;

const UserMarkerContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  animation: ${fadeInDown} 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
  z-index: 10;
`;

const UserMarkerArrow = styled.div`
  width: 50px;
  height: 50px;
  background-color: red;
  border-radius: 50% 50% 50% 50% / 0% 50% 50% 50%;
  transform: rotate(-135deg);
  position: relative;
`;

const UserMarkerRound = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #971a1a;
  position: absolute;
  bottom: 15px;
  right: 15px;
`;

const UserMarkerShadow = styled.div`
  width: 40px;
  height: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  animation: ${scaleShadow} 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
`;

const MarkerContainer = styled.div`
  position: absolute;
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  opacity: 0;
  animation: ${fadeInDownMarker} 1s cubic-bezier(0.25, 1, 0.5, 1) forwards;
  animation-delay: ${(props) => props.delay}s;
`;

const MarkerArrow = styled.div`
  width: 40px;
  height: 40px;
  background-color: #f18696;
  border-radius: 50% 50% 50% 50% / 0% 50% 50% 50%;
  transform: rotate(-135deg);
  position: relative;
`;

const MarkerRound = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #971a1a;
  position: absolute;
  bottom: 12px;
  right: 12px;
`;

const MarkerShadow = styled.div`
  width: 30px;
  height: 8px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  animation: ${scaleShadow} 1s cubic-bezier(0.25, 1, 0.5, 1) forwards;
  animation-delay: ${(props) => props.delay}s;
`;

const Title = styled.h1`
  font-size: 1rem;
`;

const Desc = styled.p`
  font-size: 0.875rem;
`;

// 마커 위치 데이터
const markerPositions = [
  { top: "45%", left: "30%" },
  { top: "30%", left: "60%" },
  { top: "70%", left: "20%" },
  { top: "60%", left: "80%" },
  { top: "20%", left: "40%" },
];

const Page1 = () => {
  const { translations } = useLanguage();

  return (
    <Page1Layout>
      <Page1Layout>
        <IllustContainer>
          <UserMarkerContainer>
            <UserMarkerArrow>
              <UserMarkerRound></UserMarkerRound>
            </UserMarkerArrow>
            <UserMarkerShadow></UserMarkerShadow>
          </UserMarkerContainer>

          {markerPositions.map((position, index) => (
            <MarkerContainer
              key={index}
              top={position.top}
              left={position.left}
              delay={1 + index * 0.2}
            >
              <MarkerArrow>
                <MarkerRound></MarkerRound>
              </MarkerArrow>
              <MarkerShadow delay={1 + index * 0.2}></MarkerShadow>
            </MarkerContainer>
          ))}
        </IllustContainer>
        <Title>{translations.page1.title}</Title>
        <Desc>{translations.page1.desc}</Desc>
      </Page1Layout>
    </Page1Layout>
  );
};

export default Page1;
