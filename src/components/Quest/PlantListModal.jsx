import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled, { css, keyframes } from "styled-components";
import { fetchData } from "../../api/FetchData";
import { mockSeasonPlantList } from "../../list/mockData";
import { useRecoilState } from "recoil";
import { selectedSeasonState } from "../../state/atom";
import { API_URL } from "../../api/apiUrl";

const ModalBackground = styled.button`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  top: 0;
  left: 0;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalLayout = styled.div`
  width: 80%;
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: white;
  border-radius: 40px;
  padding: 30px 0;
  box-sizing: border-box;
  overflow: hidden;
`;

const ModalTitle = styled.div`
  text-align: start;
  font-size: 2.25rem;
  padding: 5px 20px;
`;

const PlantNameContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap; /*너비를 초과하는 자식 요소들이 자동으로 다음 줄로 넘어가도록 */
  padding: 5px 10px;
  gap: 5px;
`;

const PlantName = styled.div`
  background-color: lightgoldenrodyellow;
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 0.75rem;
  max-width: 70px;

  // 텍스트가 넘칠 경우 줄임표시
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  //css헬퍼. 선택된 PlantName버튼 색깔 바꾸기
  ${(props) =>
    props.selected &&
    css`
      background-color: #bbe148;
    `}
`;

const PlantInfoContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 10px 0 0 0;
  overflow: hidden;
  gap: 10px;
`;

const Slide = styled.div`
  display: flex;
  justify-content: center;
  transition: transform 0.3s ease;
`;

const PlantImage = styled.div`
  width: 280px;
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: end;
  background-color: lightgrey;
  border-radius: 20px;
  flex-shrink: 0;
  background-image: url(${(props) => props.image});
  background-size: cover;
  background-position: center;
  overflow: hidden;
  margin: 0 10px;
  box-sizing: border-box;
  box-shadow: 0px 5px 8px rgba(0, 0, 0, 0.3);
`;

const PlantDesc = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  padding-top: 10px;
`;

const PlantNameOnDesc = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  margin-left: 21px;
  color: black;
`;

const Ul = styled.ul`
  padding-left: 20px; /* 불렛 포인트가 보이도록 패딩 추가 */
  margin: 0;
  list-style: disc; /* 기본 불렛 스타일 설정 */
  color: #595959;
  margin-left: 15px;
  display: flex;
  flex-direction: column;
  align-items: start;
`;

const PlantListModal = ({ isModalOpen, setIsModalOpen, questDataBySeason }) => {
  const [selectedSeason, setSelectedSeason] =
    useRecoilState(selectedSeasonState);
  const [selectedPlantIndex, setSelectedPlantIndex] = useState(0);

  const modalClickHandler = () => {
    setIsModalOpen(false);
    setSelectedPlantIndex(0); //모달 닫을 때 선택한 식물 인덱스 초기화
  };

  const plantClickHandler = (index) => {
    setSelectedPlantIndex(index);
  };

  return (
    <>
      {isModalOpen && (
        <ModalBackground onClick={modalClickHandler}>
          <ModalLayout
            onClick={(e) => {
              e.stopPropagation();
            }} //이벤트 버블링 막기
          >
            <ModalTitle>{questDataBySeason.season}</ModalTitle>
            <PlantNameContainer>
              {questDataBySeason.plants.map((plant, index) => (
                <PlantName
                  key={index}
                  onClick={() => plantClickHandler(index)}
                  selected={selectedPlantIndex === index}
                >
                  {plant.plantName}
                </PlantName>
              ))}
            </PlantNameContainer>
            <PlantInfoContainer>
              <Slide
                style={{
                  transform: `translateX(${selectedPlantIndex * -300}px)`,
                }}
              >
                {questDataBySeason.plants.map((plant, index) => (
                  <div key={index}>
                    <PlantImage image={plant.imgUrl}></PlantImage>
                    <PlantDesc>
                      <PlantNameOnDesc>{plant.plantName}</PlantNameOnDesc>
                      <Ul>
                        {plant.characteristics.map((characteristic, index) => (
                          <li key={index}>{characteristic}</li>
                        ))}
                      </Ul>
                    </PlantDesc>
                  </div>
                ))}
              </Slide>
            </PlantInfoContainer>
          </ModalLayout>
        </ModalBackground>
      )}
    </>
  );
};

export default PlantListModal;
