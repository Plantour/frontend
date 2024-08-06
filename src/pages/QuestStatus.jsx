import styled from "styled-components";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import TextArea from "../components/Quest/TextArea";
import CameraComponent from "../components/Quest/CameraComponent";
import { useRecoilState, useRecoilValue } from "recoil";
import { questDataState, selectedSeasonState } from "../state/atom";
import MapComponent from "../components/Map/MapComponent";
import { fetchData } from "../api/FetchData";
import { API_URL } from "../api/apiUrl";

const QuestStatusForm = styled.form`
  width: 100%;
  height: calc(
    100vh - 100px
  ); /* 100vh에서 Header와 Footer의 높이(50px씩)를 뺀 값 */
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CompletedQuestViewContainer = styled.div`
  width: 100%;
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ButtonsContainer = styled.div`
  height: 5%;
  background-color: black;
  color: white;
  display: flex;
  justify-content: space-between;
`;

const CancelBtn = styled(Link)`
  text-decoration: none; /* 밑줄 제거 */
  color: inherit; /* 부모 요소의 색상 상속 */
  font-size: 1.25rem;
  margin-left: 10px;
  cursor: pointer;
`;

const SubmitBtn = styled.button`
  background-color: black;
  color: white;
  font-size: 1.25rem;
  margin-right: 10px;
  border: none;
  cursor: pointer;
`;

const StyledMapComponent = styled(MapComponent)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60%;
`;

const BtnMapClose = styled.button`
  width: 100%;
  background-color: black;
  color: white;
`;

const ResponseMessage = styled.div`
  padding: 1rem;
  margin-top: 1rem;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

// completedQuest있을때 UI
const PhotoCompletedQuest = styled.div`
  background-color: pink;
  width: 375px;
  height: 375px;
`;

const TitleWrapper = styled.div`
  width: 100%;
  height: 45px;
  display: flex;
  justify-content: space-between;
  align-items: end;
  border-bottom: 1px solid #ddd;
`;

const DateCompletedQuest = styled.div``;

const PlantNameCompledtedQuest = styled.h3`
  padding-left: 10px;
`;

const ContentCompletedQuest = styled.p`
  width: 100%;
  height: 200px;
  padding: 10px;
  text-align: left;
`;

//작성된 글이 있을 경우 받아오고 없으면 글작성 UI띄우기
const QuestStatus = () => {
  const questDataBySeason = useRecoilValue(questDataState);
  const [selectedSeason, setSelectedSeason] =
    useRecoilState(selectedSeasonState);
  const { blockId } = useParams(); // URL에서 블록 번호를 가져옴
  const [plant, setPlant] = useState("Select Plant");
  const [plantId, setPlantId] = useState(null);
  const [textData, setTextData] = useState(null);
  const [today, setToday] = useState(null);
  const [imageBlob, setImageBlob] = useState(null); // Blob 상태 추가
  const [imageUrl, setImageUrl] = useState(null);
  //const [imageDataURL, setImageDataURL] = useState(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [markerPosition, setMarkerPosition] = useState({
    latitude: 51.341601163436756,
    longitude: -0.2596770172482633,
  });
  const [doesCompletedQuestExist, setDoesCompletedQuestExist] = useState(false); // 글이 존재하는지 여부
  const [responseMessage, setResponseMessage] = useState(""); // 응답 메시지 상태

  const navigate = useNavigate();

  const showDDMMYY = (dateStr) => {
    // Date 객체로 변환
    const dateObj = new Date(dateStr);

    // 영국식 날짜 형식 (8th Aug 2024)
    const day = dateObj.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[dateObj.getMonth()];
    const year = dateObj.getFullYear();

    // 서수 접미사 계산
    const getOrdinalSuffix = (day) => {
      if (day > 3 && day < 21) return "th"; // 4th - 20th
      switch (day % 10) {
        case 1:
          return "st"; // 1st, 21st, 31st
        case 2:
          return "nd"; // 2nd, 22nd
        case 3:
          return "rd"; // 3rd, 23rd
        default:
          return "th"; // 4th, 5th, ...
      }
    };

    return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
  };

  // Check if there's a completed quest for this puzzleNumber
  useEffect(() => {
    const completedQuest = questDataBySeason.completedQuests.find(
      (quest) => quest.puzzleNumber === parseInt(blockId, 10)
    );

    if (completedQuest) {
      console.log("completedQuest", completedQuest);
      setDoesCompletedQuestExist(true);
      setSelectedSeason(questDataBySeason.quest.season);
      setPlant(
        questDataBySeason.plantData.plants.find(
          (plant) => plant.plantId === completedQuest.plantId
        ).plantName
      );
      setPlantId(completedQuest.plantId);
      setImageBlob(completedQuest.imageData);
      setTextData(completedQuest.content);
      setToday(new Date(completedQuest.completedAt));
      setMarkerPosition({
        latitude: completedQuest.latitude,
        longitude: completedQuest.longitude,
      });
    } else {
      setDoesCompletedQuestExist(false);
    }
  }, [blockId, questDataBySeason]);

  const handleTextChange = (event) => {
    setTextData(event.target.value);
  };

  const handleImageChange = (blob) => {
    setImageBlob(blob);
  };

  const handleDate = (date) => {
    setToday(showDDMMYY(date));
  };

  const handleBtnClose = () => {
    setIsMapOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // 폼 제출 기본 동작 방지

    try {
      // 서버에 보낼 데이터 준비
      const formData = new FormData();
      formData.append("selectedSeason", selectedSeason);
      formData.append("puzzleNumber", blockId);
      formData.append("plantId", plantId);
      formData.append("textData", textData);
      formData.append("today", today);
      formData.append("imageData", imageBlob);
      //formData.append("imageData", imageDataURL);
      formData.append("markerLatitude", markerPosition.latitude);
      formData.append("markerLongitude", markerPosition.longitude);

      // FormData에 추가된 값 확인
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      //확인용
      // console.log(formData.get("selectedSeason"));
      // console.log(formData.get("puzzleNumber"));
      // console.log(formData.get("plantId"));
      // console.log(formData.get("textData"));
      // console.log(formData.get("today"));
      // console.log(formData.get("imageData"));
      // console.log(formData.get("markerLatitude"));
      // console.log(formData.get("markerLongitude"));

      // POST 요청 보내기
      const response = await fetchData(
        `${API_URL}/api/quests/complete`,
        "POST",
        formData
      );

      if (response.ok) {
        // 성공적으로 처리된 경우
        setResponseMessage("Data submitted successfully!");
        navigate(`/quest?animateId=${blockId}`); // Stamp 컴포넌트로 이동
      } else {
        // 오류 처리
        setResponseMessage("Failed to submit data.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setResponseMessage("Error submitting data: " + error.message);
    }
  };

  return (
    <>
      {isMapOpen ? (
        <>
          <BtnMapClose type="button" onClick={handleBtnClose}>
            Confirm Selection
          </BtnMapClose>
          <StyledMapComponent
            markerPosition={markerPosition}
            setMarkerPosition={setMarkerPosition}
          />
        </>
      ) : doesCompletedQuestExist ? (
        // 작성된 데이터가 있는 경우 표시
        <CompletedQuestViewContainer>
          <PhotoCompletedQuest>
            {imageBlob ? (
              <img src={imageBlob} alt="Completed Quest Image" />
            ) : (
              <div>No image available</div>
            )}
          </PhotoCompletedQuest>
          <TitleWrapper>
            <PlantNameCompledtedQuest>{plant}</PlantNameCompledtedQuest>
            <DateCompletedQuest>{today}</DateCompletedQuest>
          </TitleWrapper>

          <ContentCompletedQuest>{textData}</ContentCompletedQuest>

          <div></div>
        </CompletedQuestViewContainer>
      ) : (
        // 데이터가 없는 경우 폼 표시
        <QuestStatusForm onSubmit={handleSubmit}>
          <ButtonsContainer>
            <CancelBtn to="/quest">X</CancelBtn>
            <SubmitBtn type="submit">V</SubmitBtn>
          </ButtonsContainer>
          <TextArea
            value={textData}
            onChange={handleTextChange}
            handleDate={handleDate}
            plant={plant}
            setPlant={setPlant}
            setPlantId={setPlantId}
            isMapOpen={isMapOpen}
            setIsMapOpen={setIsMapOpen}
          />
          <CameraComponent
            imageBlob={imageBlob}
            setImageBlob={setImageBlob}
            onImageCapture={handleImageChange}
          />
          {isMapOpen && <StyledMapComponent />}
        </QuestStatusForm>
      )}
    </>
  );
};

export default QuestStatus;
