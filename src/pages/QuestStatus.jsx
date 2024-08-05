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

const StyledImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
`;

const TextDataCompletedQuest = styled.textarea`
  background-color: ivory;
  width: 100%;
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

  console.log(imageBlob);

  const handleTextChange = (event) => {
    setTextData(event.target.value);
  };

  const handleImageChange = (blob) => {
    setImageBlob(blob);
  };
  // const handleImageChange = (dataURL) => {
  //   setImageDataURL(dataURL);
  // };

  const handleDate = (date) => {
    setToday(date);
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

  // useEffect(() => {
  //   if (imageBlob) {
  //     // Blob을 URL로 변환
  //     const url = URL.createObjectURL(imageBlob);
  //     setImageUrl(url);

  //     // 컴포넌트가 언마운트될 때 URL을 해제
  //     return () => URL.revokeObjectURL(url);
  //   }
  // }, [imageBlob]);

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
        <QuestStatusForm>
          <div>{plant}</div>
          <PhotoCompletedQuest>
            {imageBlob ? (
              <img src={imageBlob} alt="Completed Quest Image" />
            ) : (
              <div>No image available</div>
            )}
          </PhotoCompletedQuest>
          <div>{today}</div>
          <TextDataCompletedQuest>{textData}</TextDataCompletedQuest>

          <div></div>
        </QuestStatusForm>
      ) : (
        // <QuestStatusForm>
        //   <ButtonsContainer>
        //     <CancelBtn to="/quest">X</CancelBtn>
        //   </ButtonsContainer>
        //   <TextArea
        //     value={textData}
        //     onChange={handleTextChange}
        //     handleDate={handleDate}
        //     plant={plant}
        //     setPlant={setPlant}
        //     setPlantId={setPlantId}
        //     isMapOpen={isMapOpen}
        //     setIsMapOpen={setIsMapOpen}
        //     disabled // 읽기 전용 모드
        //   />
        //   <CameraComponent
        //     // imageDataURL={imageDataURL}
        //     imageBlob={imageBlob}
        //     setImageBlob={setImageBlob}
        //     onImageCapture={handleImageChange}
        //     disabled // 이미지 캡처 불가능
        //   />
        //   {isMapOpen && <StyledMapComponent />}
        //   <ResponseMessage>{responseMessage}</ResponseMessage>
        // </QuestStatusForm>

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
