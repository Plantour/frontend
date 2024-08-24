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
import { useLanguage } from "../helpers/languageUtils";

const PageWrapper = styled.div`
  width: 100%;
  height: calc(
    100vh - 100px
  ); /* 100vh에서 Header와 Footer의 높이(50px씩)를 뺀 값 */
  position: relative;
`;

const PlantNoteForm = styled.form`
  width: 100%;
  height: 100%;
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
  const { language, translations } = useLanguage();
  const [userLocation, setUserLocation] = useRecoilState(userLocationState);
  const { blockId } = useParams(); // URL에서 블록 번호를 가져옴
  const [plant, setPlant] = useState(translations.plantNote.selectPlant);
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

  const [isTitleValid, setIsTitleValid] = useState(true);
  const [isPlantValid, setIsPlantValid] = useState(true);
  const [isTextValid, setIsTextValid] = useState(true);
  const [isLocationValid, setIsLocationValid] = useState(true);
  const [isPlantNoteImageValid, setIsPlantNoteImageValid] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [currentTextLength, setCurrentTextLength] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const navigate = useNavigate();

  const handleTextChange = (event) => {
    const text = event.target.value;
    const textLength = text.length > 100 ? 100 : text.length; // currentTextLength가 최대 100까지만 보이도록 (101이 아니라)

    setTextData(text);
    setCurrentTextLength(textLength); // 글자 수 업데이트
  };

  const handleImageChange = (blob) => {
    setImageBlob(blob);
  };

  const handleDate = (date) => {
    setToday(date);
  };

  const handleBtnClose = () => {
    setMarkerPosition(userLocation);
    setIsMapOpen(false);
  };

  //유효성검사
  const validateForm = () => {
    setIsTitleValid(!!title && title.trim().length > 0);
    setIsPlantValid(
      !!plant && plant !== "Select a plant" && plant !== "식물 선택"
    );
    setIsTextValid(!!textData && textData.trim().length > 0);
    setIsPlantNoteImageValid(!!imageBlob);
    setIsLocationValid(!!markerPosition.latitude && !!markerPosition.longitude);

    return (
      isPlantValid && isTextValid && isPlantNoteImageValid && isLocationValid
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // 폼 제출 기본 동작 방지
    setFormSubmitted(true);

    if (!validateForm()) {
      return;
    }

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
        language,
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

  const handleRedirectIfNotLoggedIn = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      alert(translations.plantNote.alert);
      navigate("/"); // 메인 페이지로 리다이렉트
    }
  };

  //글 작성 취소 버튼 클릭시
  const handleCancelClick = (e) => {
    e.preventDefault();

    const confirmed = window.confirm(translations.questStatus.cancelConfirm);

    if (confirmed) {
      navigate("/");
    }
  };

  // 토큰 유효성 검사 및 로그인 상태 확인
  useEffect(() => {
    const checkAuthentication = async () => {
      let accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        try {
          const response = await fetchData(
            `${API_URL}/api/auth/check-token`,
            "GET",
            language
          );
          console.log("accesstoken유효성검사:", response);
          if (response.data.valid) {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error("Error validating token:", error);
          setIsLoggedIn(false); // 오류 발생 시 로그인 상태를 false로 설정
        }
      } else {
        setIsLoggedIn(false); // 액세스 토큰이 없을 때도 false로 설정
      }
    };
    checkAuthentication();
  }, []);

  // Update validation states when form fields change
  useEffect(() => {
    if (formSubmitted) {
      validateForm();
    }
  }, [title, plant, textData, imageBlob, markerPosition]);

  return (
    <PageWrapper onClick={handleRedirectIfNotLoggedIn}>
      {isMapOpen && (
        <>
          <BtnMapClose type="button" onClick={handleBtnClose}>
            {translations.plantNote.confirmLocation}
          </BtnMapClose>
          <StyledMapComponent
            markerPosition={markerPosition}
            setMarkerPosition={setMarkerPosition}
          />
        </>
      )}
      <PlantNoteForm onSubmit={handleSubmit}>
        <ButtonsContainer>
          <CancelBtnAndTextWrapper>
            <CancelBtnWrapper onClick={handleCancelClick}>
              <StyledIoMdClose />
            </CancelBtnWrapper>
            <div>{translations.plantNote.createPost}</div>
          </CancelBtnAndTextWrapper>

          <PostBtn type="submit">{translations.plantNote.post}</PostBtn>
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
          isTitleValid={isTitleValid}
          isPlantValid={isPlantValid}
          isTextValid={isTextValid}
          isLocationValid={isLocationValid}
          currentTextLength={currentTextLength}
        />
        <CameraComponent
          imageBlob={imageBlob}
          setImageBlob={setImageBlob}
          onImageCapture={handleImageChange}
          isPlantNoteImageValid={isPlantNoteImageValid}
          setIsPlantNoteImageValid={setIsPlantNoteImageValid}
          formSubmitted={formSubmitted}
        />
        {isMapOpen && <StyledMapComponent />}
      </PlantNoteForm>
    </PageWrapper>
  );
};

export default PlantNote;
