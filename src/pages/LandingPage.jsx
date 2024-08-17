import React, { useState } from "react";
import styled from "styled-components";

// 각 페이지 컴포넌트
const Page1 = () => (
  <Page1Layout>
    <div>
      <UserMarker>
        <UserMarkerRound></UserMarkerRound>
      </UserMarker>
      <OtherMarkers1>
        <OtherMarkersDrop1>
          <OtherMarkersRound1></OtherMarkersRound1>
        </OtherMarkersDrop1>
      </OtherMarkers1>
    </div>
    <Title>내 주변 식물들의 위치를 확인해보세요!</Title>
    <Desc>
      다른 사용자가 찾은 식물들의 위치를 볼 수 있고, 마커를 클릭하면 식물 사진과
      설명을 볼 수 있어요.
    </Desc>
  </Page1Layout>
);
const Page2 = () => <div>미션을 수행해보세요!</div>;
const Page3 = () => <div>식물 노트를 작성해보세요!</div>;

const pages = [Page1, Page2, Page3];

const Page1Layout = styled.div`
  position: relative;
`;

const LandingPageLayout = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgb(250, 254, 255);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 1rem;
`;

const Desc = styled.p`
  font-size: 0.875rem;
`;

const UserMarker = styled.div`
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

const OtherMarkers1 = styled.div``;

const OtherMarkersDrop1 = styled.div`
  width: 40px;
  height: 40px;
  background-color: #f18696;
  border-radius: 50% 50% 50% 50% / 0% 50% 50% 50%;
  transform: rotate(-135deg);
  position: relative;
`;

const OtherMarkersRound1 = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #971a1a;
  position: absolute;
  bottom: 12px;
  right: 12px;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`;

const NextButton = styled.button`
  width: 90%;
  padding: 10px 20px;
  margin: 0 10px;
  background-color: rgba(102, 221, 221, 0.7);
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #66dddd;
  }
`;

const SkipButton = styled.button`
  width: 90%;
  padding: 10px 20px;
  margin: 0 10px;
  background-color: rgba(255, 255, 255, 0.1);
  color: black;
  border: 1px solid lightgrey;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const LandingPage = ({ onComplete }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const skipIntro = () => {
    // 여기에 인트로를 건너뛰는 로직을 구현합니다.
    // 예: 메인 앱 페이지로 리다이렉트
    console.log("Skipping intro...");
    onComplete();
  };

  const CurrentPageComponent = pages[currentPage];

  return (
    <LandingPageLayout>
      <CurrentPageComponent />
      <ButtonContainer>
        {currentPage < pages.length - 1 ? (
          <NextButton onClick={nextPage}>Next</NextButton>
        ) : (
          <SkipButton onClick={skipIntro}>Get Started</SkipButton>
        )}
        {currentPage < pages.length - 1 && (
          <SkipButton onClick={skipIntro}>Skip</SkipButton>
        )}
      </ButtonContainer>
    </LandingPageLayout>
  );
};

export default LandingPage;
