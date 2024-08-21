import styled, { css } from "styled-components";
import PlantListModal from "./PlantListModal";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { questDataState, selectedSeasonState } from "../../state/atom";
import { useLanguage } from "../../helpers/languageUtils";

const SeasonsLayout = styled.div`
  width: 100%;
  height: 40%;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
`;

const FourSeasons = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  height: 100px;
`;

const SeasonContainer = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  box-sizing: border-box;
  border: 1px solid #b2dccd;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  ${(props) =>
    props.isSelected &&
    css`
      color: white;
      width: 85px;
      height: 85px;
      border: 1px solid #2a9471;
    `}
`;

const InnerCircle = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  font-size: 1rem;
  background-color: #b2dccd;
  color: #6a8b81;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  overflow: hidden;
  transition: all 0.3s ease-in-out;

  ${(props) =>
    props.isSelected &&
    css`
      background-color: #2a9471;
      color: white;
      width: 75px;
      height: 75px;
      font-size: 2rem;
    `}
`;

const PlantListBtn = styled.button`
  width: 90px;
  height: 30px;
  background-color: #c2c2c2;
  border: none;
  border-radius: 20px;
  align-self: flex-end;
  margin-right: 25px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #b2dccd; /* 호버 시 배경색 변경 */
  }
`;

const Seasons = () => {
  const { translations } = useLanguage();
  const [selectedSeason, setSelectedSeason] =
    useRecoilState(selectedSeasonState);
  const questDataBySeason = useRecoilValue(questDataState);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const listBtnHandler = () => {
    setIsModalOpen(true);
  };

  const handleSeasonClick = (season) => {
    setSelectedSeason(season);
    console.log("seasonSelected:", selectedSeason);
  };

  return (
    <SeasonsLayout>
      <FourSeasons>
        <SeasonContainer
          onClick={() => handleSeasonClick("SPRING")}
          isSelected={selectedSeason === "SPRING"}
        >
          <InnerCircle isSelected={selectedSeason === "SPRING"}>
            {translations.seasons.spring}
          </InnerCircle>
        </SeasonContainer>
        <SeasonContainer
          onClick={() => handleSeasonClick("SUMMER")}
          isSelected={selectedSeason === "SUMMER"}
        >
          <InnerCircle isSelected={selectedSeason === "SUMMER"}>
            {translations.seasons.summer}
          </InnerCircle>
        </SeasonContainer>
        <SeasonContainer
          onClick={() => handleSeasonClick("AUTUMN")}
          isSelected={selectedSeason === "AUTUMN"}
        >
          <InnerCircle isSelected={selectedSeason === "AUTUMN"}>
            {translations.seasons.autumn}
          </InnerCircle>
        </SeasonContainer>
        <SeasonContainer
          onClick={() => handleSeasonClick("WINTER")}
          isSelected={selectedSeason === "WINTER"}
        >
          <InnerCircle isSelected={selectedSeason === "WINTER"}>
            {translations.seasons.winter}
          </InnerCircle>
        </SeasonContainer>
      </FourSeasons>
      <PlantListBtn onClick={listBtnHandler}>
        {translations.seasons.plantList}
      </PlantListBtn>
      <PlantListModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        questDataBySeason={questDataBySeason}
      />
    </SeasonsLayout>
  );
};

export default Seasons;
