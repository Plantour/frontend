import React from "react";
import styled from "styled-components";
import { useLanguage } from "../../helpers/languageUtils";
import koreaFlag from "../../assets/koreaFlag.jpg";

const ToggleContainer = styled.div`
  position: relative;
  width: 72px;
  height: 36px;
  background-color: #e4e4e4;
  border-radius: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid darkgray;
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    border-radius: 18px;
    border: 1px solid #fff;
    z-index: 1;
  }
`;

const Slider = styled.div`
  position: absolute;
  top: 2px;
  left: ${(props) => (props.isKorean ? "2px" : "38px")};
  width: 32px;
  height: 32px;
  background-color: black;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  z-index: 2;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const FlagImage = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.flagUrl});
  background-size: cover;
  background-position: center;
`;

const LanguageText = styled.span`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${(props) => (props.isKorean ? "right: 10px;" : "left: 10px;")}
  color: ${(props) => (props.isActive ? "black" : "#ffd700")};
  font-weight: ${(props) => (props.isActive ? "normal" : "bold")};
  transition: color 0.3s ease;
  pointer-events: none;
  z-index: 2;
  font-size: 11px;
`;

const LanguageToggle = () => {
  const { language, changeLanguage } = useLanguage();

  const isKorean = language === "kr";

  const handleToggle = () => {
    changeLanguage(isKorean ? "en" : "kr");
  };

  return (
    <ToggleContainer onClick={handleToggle}>
      <Slider isKorean={isKorean}>
        <FlagImage flagUrl={isKorean ? "/koreaFlag.jpg" : "/uk-flag.png"} />
      </Slider>
      <LanguageText isKorean={true} isActive={isKorean}>
        EN
      </LanguageText>
      <LanguageText isKorean={false} isActive={!isKorean}>
        KR
      </LanguageText>
    </ToggleContainer>
  );
};

export default LanguageToggle;
