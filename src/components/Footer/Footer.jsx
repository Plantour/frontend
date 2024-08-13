import styled from "styled-components";
import { useState } from "react";
import { HiOutlineMap, HiMiniMap } from "react-icons/hi2";
import { IoFlowerOutline, IoFlower } from "react-icons/io5";
import { RiImageAddLine, RiImageAddFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useLanguage } from "../../helpers/languageUtils";

const Layout = styled.div`
  height: 50px;
  background-color: ivory;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100%;
  color: black;
  font-size: 0.55rem;
  font-weight: bold;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
`;

const Circle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 50px;
  border-radius: 50%;
  background-color: transparent;
  transition: all 0.3s ease-in-out;
  /* 부모요소의 중앙에 위치시키기 */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  ${IconContainer}:hover & {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background-color: lightgoldenrodyellow;
    opacity: 1; /* Show circle on hover */
  }
`;

const IconTextWrapper = styled(Link)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-decoration: none; /*밑줄제거 */
  color: inherit; /*기본색상상속*/
  white-space: nowrap; /*텍스트 줄바꿈 없이 한줄로 표시*/
`;

const StyledHiOutlineMap = styled(HiOutlineMap)`
  width: 1.5rem;
  height: 1.5rem;
`;

const StyledHiMiniMap = styled(HiMiniMap)`
  width: 1.5rem;
  height: 1.5rem;
`;

const StyledIoFlowerOutline = styled(IoFlowerOutline)`
  width: 1.5rem;
  height: 1.5rem;
`;

const StyledIoFlower = styled(IoFlower)`
  width: 1.5rem;
  height: 1.5rem;
`;

const StyledRiImageAddLine = styled(RiImageAddLine)`
  width: 1.5rem;
  height: 1.5rem;
`;

const StyledRiImageAddFill = styled(RiImageAddFill)`
  width: 1.5rem;
  height: 1.5rem;
`;

const Footer = () => {
  const { translations, changeLanguage } = useLanguage();
  const [isMapHovered, setIsMapHovered] = useState(false);
  const [isQuestHovered, setIsQuestHovered] = useState(false);
  const [isPostHovered, setIsPostHovered] = useState(false);

  return (
    <Layout>
      <IconContainer>
        <Circle />
        <IconTextWrapper
          to="/"
          onMouseEnter={() => setIsMapHovered(true)}
          onMouseLeave={() => setIsMapHovered(false)}
        >
          {isMapHovered ? <StyledHiMiniMap /> : <StyledHiOutlineMap />}
          <div>{translations.menu.map}</div>
        </IconTextWrapper>
      </IconContainer>

      <IconContainer>
        <Circle />
        <IconTextWrapper
          to="/quest"
          onMouseEnter={() => setIsQuestHovered(true)}
          onMouseLeave={() => setIsQuestHovered(false)}
        >
          {isQuestHovered ? <StyledIoFlower /> : <StyledIoFlowerOutline />}
          <div>{translations.menu.quest}</div>
        </IconTextWrapper>
      </IconContainer>

      <IconContainer>
        <Circle />
        <IconTextWrapper
          to="/plantnote"
          onMouseEnter={() => setIsPostHovered(true)}
          onMouseLeave={() => setIsPostHovered(false)}
        >
          {isPostHovered ? <StyledRiImageAddFill /> : <StyledRiImageAddLine />}
          <div>{translations.menu.plantNote}</div>
        </IconTextWrapper>
      </IconContainer>
    </Layout>
  );
};

export default Footer;
