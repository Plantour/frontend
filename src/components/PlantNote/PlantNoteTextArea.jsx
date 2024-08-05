import styled, { keyframes } from "styled-components";
import { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { mockSeasonPlantList } from "../../list/mockData";
import { fetchData } from "../../api/FetchData";
import { useRecoilState } from "recoil";
import { selectedSeasonState } from "../../state/atom";
import { API_URL } from "../../api/apiUrl";

const TextAreaLayout = styled.div`
  width: 100%;
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

const TextAreaContainer = styled.textarea`
  width: 100%;
  height: 100px;
  border: none;
  font-size: 1rem;
  resize: none; /* 크기 조정 불가능 */
  box-sizing: border-box;
  line-height: 1.5;
  padding: 8px 10px;
`;

const TitleInput = styled.input`
  width: 100%;
  height: 30px;
  border: 1px solid lightgrey;
  font-size: 1rem;
  padding: 8px;
  margin: 10px 0;
  box-sizing: border-box;
  border-radius: 10px;
`;

const DateLocationContainer = styled.div`
  width: 100%;
  height: 30px;
  border-top: 1px solid lightgrey;
  display: flex;
  align-items: center;
  justify-content: end;
`;

const AddLocationBtn = styled.button`
  background: none; /* 배경색 제거 */
  border: none; /* 테두리 제거 */
  padding: 0; /* 기본 패딩 제거 */
  margin: 0; /* 기본 마진 제거 */
  font: inherit; /* 부모 요소의 폰트 스타일을 상속받음 */
  cursor: pointer; /* 클릭할 수 있음을 나타내는 커서 */
  box-shadow: none; /* 기본 박스 그림자 제거 */
  text-align: inherit; /* 텍스트 정렬 상속 */
  appearance: none; /* 브라우저 기본 스타일 제거 */
  outline: none; /* 포커스 시 나타나는 외곽선 제거 */
`;

// 식물 선택방법 모달 스타일링
const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const ModalOption = styled.div`
  padding: 10px 0;
  cursor: pointer;
`;

// 새로운 모달 스타일링
const AllFlowerListModalBackground = styled(ModalBackground)``;

const AllFlowerListModalContainer = styled(ModalContainer)`
  max-height: 80%;
  overflow-y: auto;
`;

const EachItemOnAllPlantList = styled.div`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const PlantListImg = styled.img`
  width: 100px;
  height: 100px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InputField = styled.input`
  padding: 8px;
  font-size: 1rem;
`;

const PlantNoteTextArea = ({
  value,
  onChange,
  handleDate,
  plant,
  setPlant,
  setPlantId,
  isMapOpen,
  setIsMapOpen,
  markerPosition,
  title,
  setTitle,
}) => {
  const [selectedSeason, setSelectedSeason] =
    useRecoilState(selectedSeasonState);
  const [allSeasonPlantList, setAllSeasonPlantList] =
    useState(mockSeasonPlantList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAllFlowerListModalOpen, setIsAllFlowerListModalOpen] =
    useState(false);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  handleDate(formattedDate);

  const handlePlantSelection = (plantName, plantId) => {
    setPlant(plantName); // 선택된 꽃으로 상태 업데이트
    setPlantId(plantId);
    setIsModalOpen(false); // 드롭다운 닫기
    setIsAllFlowerListModalOpen(false); //식물리스트 드롭다운 닫기
  };

  const locationBtnClickHandler = () => {
    console.log("Button clicked"); // 상태 업데이트 로그
    setIsMapOpen(true);
    console.log("isMapOpen:", true);
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleModalOptionSelect = (option) => {
    if (option === "list") {
      setIsAllFlowerListModalOpen(true);
    } else if (option === "input") {
      // 직접 입력 기능
      setIsInputOpen(true);
    } else if (option === "unknown") {
      setPlant("모르겠음");
    }
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    if (inputValue.trim()) {
      setPlant(inputValue);
    }
    setInputValue(""); // 입력 필드를 초기화
    setIsInputOpen(false); // 입력 모달 닫기
  };

  useEffect(() => {
    const fetchAllSeasonPlantData = async () => {
      try {
        const data = await fetchData(`${API_URL}/api/plants`, "GET");
        if (data) {
          // 데이터가 있는 경우 상태 업데이트
          setAllSeasonPlantList(data);
          console.log(data);
        } else {
          // 데이터가 없는 경우 상태 업데이트
          console.log("no data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllSeasonPlantData();
  }, [selectedSeason]);

  //   useEffect(() => {
  //     const fetchplantData = async () => {
  //       try {
  //         const response = await fetchData(
  //           `${API_URL}/api/quests?season=${selectedSeason}`
  //         ); //fetchData함수 외부에선언함 (api폴더)

  //         console.log("all season plant list:", response);
  //         setAllSeasonPlantList(response);
  //       } catch (error) {
  //         console.error("Error fetching plant data:", error);
  //       }
  //     };

  //     fetchplantData();
  //   }, []);

  return (
    <TextAreaLayout>
      <TitleInput
        type="text"
        placeholder="Enter the title"
        value={title}
        onChange={(e) => setTitle(e.target.value)} // 제목 상태 변경
      />
      <PlantListToggle onClick={handleModalToggle}>{plant}</PlantListToggle>
      {isInputOpen && (
        <InputContainer>
          <InputField
            type="text"
            placeholder="Enter the plant name"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur} // 포커스가 벗어나면 값 저장
          />
        </InputContainer>
      )}

      {isModalOpen && (
        <ModalBackground onClick={handleModalToggle}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalOption onClick={() => handleModalOptionSelect("list")}>
              목록에서 고르기
            </ModalOption>
            <ModalOption onClick={() => handleModalOptionSelect("input")}>
              직접 입력
            </ModalOption>
            <ModalOption onClick={() => handleModalOptionSelect("unknown")}>
              모르겠음
            </ModalOption>
          </ModalContainer>
        </ModalBackground>
      )}

      {isAllFlowerListModalOpen && (
        <AllFlowerListModalBackground
          onClick={() => setIsAllFlowerListModalOpen(false)}
        >
          <AllFlowerListModalContainer onClick={(e) => e.stopPropagation()}>
            {allSeasonPlantList.map((item) => (
              <EachItemOnAllPlantList
                key={item.id}
                onClick={() => handlePlantSelection(item.name, item.id)}
              >
                {item.name}
                <PlantListImg src={item.image}></PlantListImg>
              </EachItemOnAllPlantList>
            ))}
          </AllFlowerListModalContainer>
        </AllFlowerListModalBackground>
      )}

      <TextAreaContainer
        placeholder="Tell us about your discovery!"
        value={value}
        onChange={onChange}
      />
      <DateLocationContainer>
        {formattedDate}/{" "}
        <AddLocationBtn type="button" onClick={locationBtnClickHandler}>
          {markerPosition.latitude && markerPosition.longitude ? (
            <div>Location Added</div>
          ) : (
            <div>Add Location</div>
          )}
        </AddLocationBtn>
      </DateLocationContainer>
    </TextAreaLayout>
  );
};

export default PlantNoteTextArea;
