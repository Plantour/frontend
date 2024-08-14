import styled, { keyframes } from "styled-components";
import { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { mockSeasonPlantList } from "../../list/mockData";
import { fetchData } from "../../api/FetchData";
import { useRecoilState } from "recoil";
import { selectedSeasonState } from "../../state/atom";
import { API_URL } from "../../api/apiUrl";
import { FaChevronDown } from "react-icons/fa";
import { useLanguage } from "../../helpers/languageUtils";

const TextAreaLayout = styled.div`
  width: 100%;
  height: 35%;
  background-color: ${({ theme }) => theme.colors.lightgrey1};
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const PlantListAndInputContainer = styled.div`
  width: 95%;
  display: flex;
  justify-content: start;
  gap: 5px;
`;

const PlantListToggle = styled.div`
  height: 30px;
  display: flex;
  justify-content: start;
  align-items: center;
  cursor: pointer;
  gap: 3px;
`;

const InputField = styled.input`
  width: 60%;
  padding: 3px;
  font-size: 1rem;
  border: 1px solid lightgrey;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.lightgrey1};
`;

const FaChevronDownContainer = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TextAreaContainer = styled.textarea`
  width: 95%;
  border: none;
  font-size: 1rem;
  resize: none; /* 크기 조정 불가능 */
  box-sizing: border-box;
  line-height: 1.5;
  padding: 8px 0;
  background-color: ${({ theme }) => theme.colors.lightgrey1};
  max-height: 6rem; /* 3줄 높이로 제한 (line-height * 3) */
  overflow: hidden; /* 줄 수를 초과하는 내용 숨김 */
`;

const TitleInput = styled.input`
  width: 95%;
  height: 25px;
  background-color: ${({ theme }) => theme.colors.lightgrey1};
  font-size: 1rem;
  padding: 8px;
  border: none;
  cursor: pointer;
`;

const DateLocationContainer = styled.div`
  width: 95%;
  height: 30px;
  font-size: 0.875rem;
  border-bottom: 1px solid lightgrey;
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 5px;
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
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const ModalOption = styled.div`
  padding: 10px 0;
  cursor: pointer;
`;

// 새로운 모달 스타일링
const AllFlowerListModalBackground = styled(ModalBackground)``;

const AllFlowerListModalContainer = styled(ModalContainer)`
  width: 220px;
  max-height: 80%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const EachItemOnAllPlantList = styled.div`
  width: 100%;
  padding: 10px 0px;
  cursor: pointer;
  gap: 5px;
  border-bottom: 1px solid lightgrey;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const PlantListImg = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 10px;
  object-fit: cover;
  overflow: hidden;
`;

const PlantListName = styled.div``;

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
  const { translations, language } = useLanguage();
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
  const formattedDate =
    language === "en"
      ? today.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : `${today.getFullYear()}년 ${
          today.getMonth() + 1
        }월 ${today.getDate()}일`;

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
        const response = await fetchData(`${API_URL}/api/plants`, "GET");
        if (response.ok) {
          // 데이터가 있는 경우 상태 업데이트
          setAllSeasonPlantList(response.data);
          console.log("response data", response.data);
        } else {
          // 데이터가 없는 경우 상태 업데이트
          console.log("no all season plant data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllSeasonPlantData();
  }, [selectedSeason]);

  // 언어 변경 시 plant 상태 업데이트
  useEffect(() => {
    setPlant(translations.plantNote.selectPlant);
  }, [translations]);

  return (
    <TextAreaLayout>
      <TitleInput
        type="text"
        placeholder={translations.plantNoteTextArea.addTitle}
        value={title}
        onChange={(e) => setTitle(e.target.value)} // 제목 상태 변경
      />
      <PlantListAndInputContainer>
        <PlantListToggle onClick={handleModalToggle}>
          <span>{plant}</span>
          <FaChevronDownContainer>
            <FaChevronDown />
          </FaChevronDownContainer>
        </PlantListToggle>
        {isInputOpen && (
          <InputField
            type="text"
            placeholder={translations.plantNoteTextArea.enterPlantName}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur} // 포커스가 벗어나면 값 저장
          />
        )}
      </PlantListAndInputContainer>

      {isModalOpen && (
        <ModalBackground onClick={handleModalToggle}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalOption onClick={() => handleModalOptionSelect("list")}>
              {translations.plantNoteTextArea.selectFromList}
            </ModalOption>
            <ModalOption onClick={() => handleModalOptionSelect("input")}>
              {translations.plantNoteTextArea.enterManually}
            </ModalOption>
            <ModalOption onClick={() => handleModalOptionSelect("unknown")}>
              {translations.plantNoteTextArea.iDontKnow}
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
                <PlantListImg src={item.image}></PlantListImg>
                <PlantListName>{item.name}</PlantListName>
              </EachItemOnAllPlantList>
            ))}
          </AllFlowerListModalContainer>
        </AllFlowerListModalBackground>
      )}

      <TextAreaContainer
        placeholder={translations.plantNoteTextArea.addDescription}
        value={value}
        onChange={onChange}
        rows={3}
      />
      <DateLocationContainer>
        {formattedDate}/{" "}
        <AddLocationBtn type="button" onClick={locationBtnClickHandler}>
          {markerPosition.latitude && markerPosition.longitude ? (
            <div>{translations.plantNoteTextArea.locationAdded}</div>
          ) : (
            <div>{translations.plantNoteTextArea.addLocation}</div>
          )}
        </AddLocationBtn>
      </DateLocationContainer>
    </TextAreaLayout>
  );
};

export default PlantNoteTextArea;
