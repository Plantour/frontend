import React from "react";
import styled, { keyframes } from "styled-components";

const writePost = keyframes`
  0% { width: 0; }
  50% { width: 80%; }
  100% { width: 80%; }
`;

const transformToLetter = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(0.8) rotate(10deg); }
  100% { transform: scale(0.6) rotate(0deg); }
`;

const moveToMap = keyframes`
  0% { transform: translate(0, 0) scale(0.6); }
  100% { transform: translate(50px, -50px) scale(0.3); }
`;

const pinDrop = keyframes`
  0% { transform: translateY(-20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

const IllustContainer = styled.div`
  width: 100%;
  height: 70%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Post = styled.div`
  width: 200px;
  height: 150px;
  background-color: white;
  border: 2px solid #333;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  animation: ${writePost} 2s ease-out, ${transformToLetter} 2s 3s ease-in-out,
    ${moveToMap} 2s 5s ease-in-out;
  animation-fill-mode: forwards;
  z-index: 10;
`;

const PostContent = styled.div`
  width: 0;
  height: 15px;
  background-color: #333;
  margin: 20px 20px 10px;
  animation: ${writePost} 2s ease-out;
`;

const Map = styled.div`
  width: 250px;
  height: 200px;
  background-color: #e6f3ff;
  border: 2px solid #333;
  border-radius: 10px;
  position: absolute;
  top: 20px;
  right: 20px;
`;

const Marker = styled.div`
  width: 20px;
  height: 20px;
  background-color: #ff4136;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  position: absolute;
  bottom: 40px;
  right: 80px;
  opacity: 0;
  animation: ${pinDrop} 0.5s 7s ease-in-out forwards;
`;

const AnimatedIllustration = () => (
  <IllustContainer>
    <Post>
      <PostContent />
      <PostContent style={{ width: "60%" }} />
      <PostContent style={{ width: "40%" }} />
    </Post>
    <Map>
      <Marker />
    </Map>
  </IllustContainer>
);

const Page3Layout = styled.div`
  width: 100%;
  height: 60%;
  display: flex;
  flex-direction: column;
  justify-content: end;
  padding-bottom: 10px;
  gap: 5px;
`;

const Title = styled.h1`
  font-size: 1rem;
`;

const Desc = styled.p`
  font-size: 0.875rem;
`;

const Page3 = () => (
  <Page3Layout>
    <AnimatedIllustration />
    <Title>식물 노트를 작성해보세요!</Title>
    <Desc>
      식물에 대한 기록을 남기면, 근처에 있는 회원이 내 식물 노트를 볼 수 있어요.
    </Desc>
  </Page3Layout>
);

export default Page3;
