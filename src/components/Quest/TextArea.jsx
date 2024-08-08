import styled, { keyframes } from "styled-components";
import { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { mockSeasonPlantList } from "../../list/mockData";
import { fetchData } from "../../api/FetchData";
import { useRecoilState } from "recoil";
import { questDataState, selectedSeasonState } from "../../state/atom";
import { API_URL } from "../../api/apiUrl";

const heightExpand = keyframes`
  from{
    height: 0;
    background-color: rgba(255,255,255,0)
  } to{
    height: 200px;
    background-color: rgba(255,255,255,1)
  }
`;

const appear = keyframes`
from{    
    opacity:0;
  } to{    
    opacity:1;
  }  
`;

const TextAreaLayout = styled.div`
  height: 25%;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const PlantListToggle = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid lightgrey;
`;

const StyledIoMdArrowDropdown = styled(IoMdArrowDropdown)`
  font-size: 1.25rem;
`;

const PlantToggleEmoji = styled.span``;

const PlantList = styled.div`
  position: absolute;
  z-index: 10;
  width: 120px;
  padding: 10px 0;
  top: 0px;
  cursor: pointer;
  box-shadow: 0px 10px 10px 5px rgba(0, 0, 0, 0.25);
  animation: ${heightExpand} 0.2s ease-out forwards;
`;

const PlantListItem = styled.div`
  animation: ${appear} 0.1s ease-out forwards;
  animation-delay: 0.2s; /* plantList 애니메이션 이후에 시작되도록 지연 설정 */
  opacity: 0; /* 애니메이션이 시작되기 전에는 숨김 */
`;

const TextAreaContainer = styled.textarea`
  width: 100%;
  height: 100px;
  border: none;
  font-size: 1rem;
  resize: none; /* 크기 조정 불가능 */
  box-sizing: border-box;

  /* 밑줄효과 */
  /* background-attachment: local;
  background-image: linear-gradient(to right, white 10px, transparent 10px),
    linear-gradient(to left, white 10px, transparent 10px),
    repeating-linear-gradient(
      white,
      white 30px,
      #ccc 30px,
      #ccc 31px,
      white 31px
    ); */
  line-height: 1.5;
  padding: 8px 10px;
`;

const DateLocationContainer = styled.div`
  width: 100%;
  height: 30px;
  border-top: 1px solid lightgrey;
  display: flex;
  align-items: center;
  justify-content: end;
`;

const TextArea = ({
  value,
  onChange,
  handleDate,
  plant,
  setPlant,
  setPlantId,
  isMapOpen,
  setIsMapOpen,
}) => {
  const [selectedSeason, setSelectedSeason] =
    useRecoilState(selectedSeasonState);
  const [questDataBySeason, setQuestDataBySeason] =
    useRecoilState(questDataState);
  const [seasonplantList, setSeasonplantList] = useState(mockSeasonPlantList);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  handleDate(formattedDate);

  const handleplantSelection = (plantName, plantId) => {
    console.log("trying handle plant selection");
    console.log("questDataBySeason", questDataBySeason);
    setPlant(plantName); // 선택된 꽃으로 상태 업데이트
    setPlantId(plantId);
    setIsDropdownOpen(false); // 드롭다운 닫기
  };

  const locationBtnClickHandler = () => {
    console.log("Button clicked"); // 상태 업데이트 로그
    setIsMapOpen(true);
    console.log("isMapOpen:", true);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
    console.log(isDropdownOpen); //함수가 비동기적으로 동작해서 열렸을때 false가 찍힘. 기능적으로는 이상이 없어서 수정하지 않음
  };

  // useEffect(() => {
  //   const fetchplantData = async () => {
  //     try {
  //       console.log("trying fetch");
  //       const response = await fetchData(
  //         `${API_URL}/api/quests?season=${selectedSeason}`
  //       ); //fetchData함수 외부에선언함 (api폴더)

  //       console.log("seasonplantlist:", response);
  //       setSeasonplantList(response);
  //     } catch (error) {
  //       console.error("Error fetching plant data:", error);
  //     }
  //   };

  //   fetchplantData();
  // }, []);

  return (
    <TextAreaLayout>
      <PlantListToggle onClick={handleDropdownToggle}>
        {plant}
        {plant == "Select plant" ? (
          <StyledIoMdArrowDropdown />
        ) : (
          <plantToggleEmoji>🌿</plantToggleEmoji>
        )}
      </PlantListToggle>
      {isDropdownOpen && (
        <PlantList>
          {questDataBySeason.plantData.plants.map((item) => (
            <PlantListItem
              key={item.plantId}
              onClick={() => handleplantSelection(item.plantName, item.plantId)}
            >
              {item.plantName}
            </PlantListItem>
          ))}
        </PlantList>
      )}
      <TextAreaContainer
        placeholder="Tell us about your discovery!"
        value={value}
        onChange={onChange}
      />
      <DateLocationContainer>
        {formattedDate}/{" "}
        <button type="button" onClick={locationBtnClickHandler}>
          discovered from..
        </button>
      </DateLocationContainer>
    </TextAreaLayout>
  );
};

export default TextArea;
