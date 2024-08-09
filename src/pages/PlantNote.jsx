import styled from "styled-components";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import TextArea from "../components/Quest/TextArea";
import CameraComponent from "../components/Quest/CameraComponent";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  questDataState,
  selectedSeasonState,
  userLocationState,
} from "../state/atom";
import MapComponent from "../components/Map/MapComponent";
import { fetchData } from "../api/FetchData";
import { API_URL } from "../api/apiUrl";
import PlantNoteTextArea from "../components/PlantNote/PlantNoteTextArea";
import { IoMdClose } from "react-icons/io";

const PlantNoteForm = styled.form`
  width: 100%;
  height: calc(
    100vh - 100px
  ); /* 100vh에서 Header와 Footer의 높이(50px씩)를 뺀 값 */
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.lightgrey1};
`;

const ButtonsContainer = styled.div`
  width: 100%;
  height: 5%;
  background-color: ${({ theme }) => theme.colors.lightgrey1};
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 2;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    box-shadow: 0px 5px 8px rgba(0, 0, 0, 0.2);
  }
`;

const CancelBtnAndTextWrapper = styled.div`
  display: flex;
  font-weight: bold;
  color: black;
`;

const CancelBtnWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
`;

const StyledIoMdClose = styled(IoMdClose)`
  font-size: 1.5rem;
  cursor: pointer;
`;

const PostBtn = styled.button`
  color: #289bff;
  margin-right: 10px;
  border: none;
  cursor: pointer;
`;

const StyledMapComponent = styled(MapComponent)`
  position: absolute;
  top: 0;
  left: 0;
`;

const BtnMapClose = styled.button`
  width: 180px;
  height: 45px;
  background-color: black;
  color: white;
  border-radius: 25px;
  position: absolute;
  bottom: 100px;
  z-index: 1000;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
`;

const PlantNote = () => {
  const [userLocation, setUserLocation] = useRecoilState(userLocationState);
  const { blockId } = useParams(); // URL에서 블록 번호를 가져옴
  const [plant, setPlant] = useState("Select a plant");
  const [plantId, setPlantId] = useState(null);
  const [textData, setTextData] = useState(null);
  const [today, setToday] = useState(null);
  const [imageBlob, setImageBlob] = useState(null); // Blob 상태 추가
  const [imageUrl, setImageUrl] = useState(null);
  //const [imageDataURL, setImageDataURL] = useState(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [markerPosition, setMarkerPosition] = useState({
    latitude: null,
    longitude: null,
  });
  const [doesCompletedQuestExist, setDoesCompletedQuestExist] = useState(false); // 글이 존재하는지 여부
  const [responseMessage, setResponseMessage] = useState(""); // 응답 메시지 상태
  const [title, setTitle] = useState("");

  const navigate = useNavigate();

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
    setMarkerPosition(userLocation);
    console.log("marker position:", markerPosition);
    setIsMapOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // 폼 제출 기본 동작 방지

    // Determine infoType and plantInfo based on plant state
    let infoType = "";
    let plantInfo = "";

    if (plant === "모르겠음") {
      infoType = "UNKNOWN";
    } else if (plantId) {
      infoType = "SELECTED";
      // plantId를 직접 사용
    } else {
      infoType = "CUSTOM";
      plantInfo = plant; // Set plantInfo if plantId is not available
    }

    try {
      // 서버에 보낼 데이터 준비
      const formData = new FormData();

      formData.append("today", today);
      formData.append("title", title); //글제목 Set the appropriate title here
      formData.append("content", textData); // Ensure content is not null
      formData.append("infoType", infoType);
      if (infoType === "SELECTED") {
        formData.append("plantId", plantId); // Append plantId if infoType is 'SELECTED'
      } else if (infoType === "CUSTOM") {
        formData.append("plantInfo", plant); // Append plantInfo if infoType is 'CUSTOM'
      }
      formData.append("latitude", markerPosition.latitude || ""); // Ensure latitude is not null
      formData.append("longitude", markerPosition.longitude || ""); // Ensure longitude is not null
      formData.append("image", imageBlob); // Append imageBlob if available

      // FormData에 추가된 값 확인
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      // POST 요청 보내기
      const response = await fetchData(
        `${API_URL}/api/plant-notes/create`,
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
            Confirm Location
          </BtnMapClose>
          <StyledMapComponent
            markerPosition={markerPosition}
            setMarkerPosition={setMarkerPosition}
          />
        </>
      ) : (
        <PlantNoteForm onSubmit={handleSubmit}>
          <ButtonsContainer>
            <CancelBtnAndTextWrapper>
              <CancelBtnWrapper to="/">
                <StyledIoMdClose />
              </CancelBtnWrapper>
              <div>Created a post</div>
            </CancelBtnAndTextWrapper>

            <PostBtn type="submit">Post</PostBtn>
          </ButtonsContainer>
          <PlantNoteTextArea
            value={textData}
            onChange={handleTextChange}
            handleDate={handleDate}
            plant={plant}
            setPlant={setPlant}
            setPlantId={setPlantId}
            isMapOpen={isMapOpen}
            setIsMapOpen={setIsMapOpen}
            markerPosition={markerPosition}
            title={title}
            setTitle={setTitle}
          />
          <CameraComponent
            imageBlob={imageBlob}
            setImageBlob={setImageBlob}
            onImageCapture={handleImageChange}
          />
          {isMapOpen && <StyledMapComponent />}
        </PlantNoteForm>
      )}
    </>
  );
};

export default PlantNote;
