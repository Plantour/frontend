import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";
import flowerSticker from "../../assets/flowerSticker.png";
import { useRecoilState, useRecoilValue } from "recoil";
import { questDataState, selectedSeasonState } from "../../state/atom";
import { fetchData } from "../../api/FetchData";
import { API_URL } from "../../api/apiUrl";
import quest_spring_01 from "../../assets/quest_spring_01.png";
import quest_spring_02 from "../../assets/quest_spring_02.png";
import quest_spring_03 from "../../assets/quest_spring_03.png";
import quest_spring_04 from "../../assets/quest_spring_04.png";
import quest_spring_05 from "../../assets/quest_spring_05.png";
import quest_spring_06 from "../../assets/quest_spring_06.png";
import quest_spring_07 from "../../assets/quest_spring_07.png";
import quest_spring_08 from "../../assets/quest_spring_08.png";
import quest_spring_09 from "../../assets/quest_spring_09.png";
import quest_summer_01 from "../../assets/quest_summer_01.png";
import quest_summer_02 from "../../assets/quest_summer_02.png";
import quest_summer_03 from "../../assets/quest_summer_03.png";
import quest_summer_04 from "../../assets/quest_summer_04.png";
import quest_summer_05 from "../../assets/quest_summer_05.png";
import quest_summer_06 from "../../assets/quest_summer_06.png";
import quest_summer_07 from "../../assets/quest_summer_07.png";
import quest_summer_08 from "../../assets/quest_summer_08.png";
import quest_summer_09 from "../../assets/quest_summer_09.png";
import quest_autumn_01 from "../../assets/quest_autumn_01.png";
import quest_autumn_02 from "../../assets/quest_autumn_02.png";
import quest_autumn_03 from "../../assets/quest_autumn_03.png";
import quest_autumn_04 from "../../assets/quest_autumn_04.png";
import quest_autumn_05 from "../../assets/quest_autumn_05.png";
import quest_autumn_06 from "../../assets/quest_autumn_06.png";
import quest_autumn_07 from "../../assets/quest_autumn_07.png";
import quest_autumn_08 from "../../assets/quest_autumn_08.png";
import quest_autumn_09 from "../../assets/quest_autumn_09.png";
import quest_winter_01 from "../../assets/quest_winter_01.png";
import quest_winter_02 from "../../assets/quest_winter_02.png";
import quest_winter_03 from "../../assets/quest_winter_03.png";
import quest_winter_04 from "../../assets/quest_winter_04.png";
import quest_winter_05 from "../../assets/quest_winter_05.png";
import quest_winter_06 from "../../assets/quest_winter_06.png";
import quest_winter_07 from "../../assets/quest_winter_07.png";
import quest_winter_08 from "../../assets/quest_winter_08.png";
import quest_winter_09 from "../../assets/quest_winter_09.png";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const StampLayout = styled.div`
  height: 60%;
  display: flex;
  justify-content: center;
  align-items: start;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  width: 300px;
  height: 300px;
  gap: 10px;
`;

const StampBlock = styled(Link)`
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  box-shadow: 0px 5px 6px rgba(128, 128, 128, 0.3);
`;

const ImgSticker = styled.img`
  width: 100%;
  height: 100%;
  ${(props) =>
    props.animate &&
    css`
      animation: ${fadeIn} 0.5s ease-in-out;
    `}
  filter: ${(props) => (props.completed ? "none" : "grayscale(100%)")};
`;

const imageMap = {
  SPRING: {
    1: quest_spring_01,
    2: quest_spring_02,
    3: quest_spring_03,
    4: quest_spring_04,
    5: quest_spring_05,
    6: quest_spring_06,
    7: quest_spring_07,
    8: quest_spring_08,
    9: quest_spring_09,
  },
  SUMMER: {
    1: quest_summer_01,
    2: quest_summer_02,
    3: quest_summer_03,
    4: quest_summer_04,
    5: quest_summer_05,
    6: quest_summer_06,
    7: quest_summer_07,
    8: quest_summer_08,
    9: quest_summer_09,
  },
  AUTUMN: {
    1: quest_autumn_01,
    2: quest_autumn_02,
    3: quest_autumn_03,
    4: quest_autumn_04,
    5: quest_autumn_05,
    6: quest_autumn_06,
    7: quest_autumn_07,
    8: quest_autumn_08,
    9: quest_autumn_09,
  },
  WINTER: {
    1: quest_winter_01,
    2: quest_winter_02,
    3: quest_winter_03,
    4: quest_winter_04,
    5: quest_winter_05,
    6: quest_winter_06,
    7: quest_winter_07,
    8: quest_winter_08,
    9: quest_winter_09,
  },
};

const Stamp = ({ animateId, setAnimateId }) => {
  const [selectedSeason, setSelectedSeason] =
    useRecoilState(selectedSeasonState);
  const questDataBySeason = useRecoilValue(questDataState);
  //const [completedQuests, setCompletedQuests] = useState([]);

  // 9개의 블록 초기화
  const [allBlocks, setAllBlocks] = useState(
    Array.from({ length: 9 }, (_, i) => ({ blockId: i + 1 })) // 9개의 블록 초기화
  );

  // const [stamps, setStamps] = useState([
  //   { id: 1, completed: true },
  //   { id: 2, completed: false },
  //   { id: 3, completed: true },
  //   { id: 4, completed: false },
  //   { id: 5, completed: true },
  //   { id: 6, completed: false },
  //   { id: 7, completed: true },
  //   { id: 8, completed: false },
  //   { id: 9, completed: true },
  // ]);

  //서버에서 해당 시즌 stamp정보 받아오기
  // useEffect(() => {
  //   const fetchStamps = async () => {
  //     try {
  //       const response = await fetchData(`${API_URL}/api/quests?season=${selectedSeason}`,"GET");
  //       if (response.ok) {
  //         const data = await response.json();
  //         if (data) {
  //           // 데이터가 있는 경우 상태 업데이트

  //         }
  //       } else {
  //         // 데이터가 없는 경우 상태 업데이트
  //         setIsEditing(false);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       setResponseMessage("Error fetching data: " + error.message);
  //     }
  //   };

  //   fetchStamps();
  //   console.log(animateId);
  // }, [selectedSeason]);

  // 애니메이션 후 animateId를 초기화하는 로직
  useEffect(() => {
    if (animateId !== null) {
      const timer = setTimeout(() => {
        setAnimateId(null); // 애니메이션 후 초기화
      }, 1000); // 애니메이션 지속 시간과 맞춰서 설정

      return () => clearTimeout(timer);
    }
  }, [animateId]);

  console.log(animateId);

  // questDataBySeason에서 ID만 추출
  const completedBlockIds = new Set(
    questDataBySeason.completedQuests.map((quest) => quest.puzzleNumber)
  );

  // 선택된 시즌에 맞는 이미지 맵 선택
  const currentImageMap = imageMap[selectedSeason] || {};

  return (
    <StampLayout>
      <GridContainer>
        {allBlocks.map((block) => (
          <StampBlock
            key={block.blockId}
            to={`/queststatus/${selectedSeason}/${block.blockId}`}
          >
            <ImgSticker
              animate={block.blockId === parseInt(animateId, 10)} // 애니메이션 적용 조건
              src={currentImageMap[block.blockId]}
              alt={`block-${block.blockId}`}
              completed={completedBlockIds.has(block.blockId)} //완료된 블록 여부전달
            />
          </StampBlock>
        ))}
      </GridContainer>
    </StampLayout>
  );
};

export default Stamp;
