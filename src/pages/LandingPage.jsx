import React, { useState } from "react";
import styled from "styled-components";

// 각 페이지 컴포넌트
const Page1 = () => <div>내 주변 식물들의 위치를 확인해보세요!</div>;
const Page2 = () => <div>미션을 수행해보세요!</div>;
const Page3 = () => <div>식물 노트를 작성해보세요!</div>;

const pages = [Page1, Page2, Page3];

const LandingPageLayout = styled.div`
  width: 100%;
  height: 100%;
  background-color: lightblue;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 0 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
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
      <div>
        {currentPage < pages.length - 1 ? (
          <Button onClick={nextPage}>Next</Button>
        ) : (
          <Button onClick={skipIntro}>Get Started</Button>
        )}
        {currentPage < pages.length - 1 && (
          <Button onClick={skipIntro}>Skip</Button>
        )}
      </div>
    </LandingPageLayout>
  );
};

export default LandingPage;
