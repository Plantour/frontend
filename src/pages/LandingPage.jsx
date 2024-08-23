import React, { useState } from "react";
import styled from "styled-components";
import Page1 from "../components/Landing/Page1";
import Page2 from "../components/Landing/Page2";
import Page3 from "../components/Landing/Page3";
import LanguageToggle from "../components/Header/LanguageToggle";

const pages = [Page1, Page2, Page3];

const LandingPageLayout = styled.div`
  width: 100%;
  height: 100vh;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ToggleContainer = styled.div`
  width: 90%;
  display: flex;
  justify-content: end;
  padding: 5px 0;
`;

const ButtonContainer = styled.div`
  width: 100%;
  height: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
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
      <ToggleContainer>
        <LanguageToggle />
      </ToggleContainer>

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
