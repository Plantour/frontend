import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
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
import { IoMdClose } from "react-icons/io";
import { useLanguage } from "../helpers/languageUtils";

const QuestStatusForm = styled.form`
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

const CompletedQuestViewContainer = styled.div`
  width: 100%;
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ButtonsContainer = styled.div`
  width: 100%;
  height: 5%;
  background-color: #efefef;
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
  width: 100%;
  height: 60%;
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

const ImgContainer = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  const { language, translations } = useLanguage();
  const questDataBySeason = useRecoilValue(questDataState);
  const [selectedSeason, setSelectedSeason] =
    useRecoilState(selectedSeasonState);
  const [userLocation, setUserLocation] = useRecoilState(userLocationState);
  const { blockId } = useParams(); // URL에서 블록 번호를 가져옴
  const [plant, setPlant] = useState("");
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

  const [isPlantValid, setIsPlantValid] = useState(true);
  const [isTextValid, setIsTextValid] = useState(true);
  const [isLocationValid, setIsLocationValid] = useState(true);
  const [isQuestImageValid, setIsQuestImageValid] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [currentTextLength, setCurrentTextLength] = useState(0);

  const [responseMessage, setResponseMessage] = useState(""); // 응답 메시지 상태

  const navigate = useNavigate();

  // 언어에 따라 날짜 형식 변경
  const formatDate = (dateStr) => {
    const dateObj = new Date(dateStr);

    if (language === "en") {
      return dateObj.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } else {
      return `${dateObj.getFullYear()}년 ${
        dateObj.getMonth() + 1
      }월 ${dateObj.getDate()}일`;
    }
  };

  // const showDDMMYY = (dateStr) => {
  //   // Date 객체로 변환
  //   const dateObj = new Date(dateStr);

  //   // 영국식 날짜 형식 (8th Aug 2024)
  //   const day = dateObj.getDate();
  //   const monthNames = [
  //     "Jan",
  //     "Feb",
  //     "Mar",
  //     "Apr",
  //     "May",
  //     "Jun",
  //     "Jul",
  //     "Aug",
  //     "Sep",
  //     "Oct",
  //     "Nov",
  //     "Dec",
  //   ];
  //   const month = monthNames[dateObj.getMonth()];
  //   const year = dateObj.getFullYear();

  //   // 서수 접미사 계산
  //   const getOrdinalSuffix = (day) => {
  //     if (day > 3 && day < 21) return "th"; // 4th - 20th
  //     switch (day % 10) {
  //       case 1:
  //         return "st"; // 1st, 21st, 31st
  //       case 2:
  //         return "nd"; // 2nd, 22nd
  //       case 3:
  //         return "rd"; // 3rd, 23rd
  //       default:
  //         return "th"; // 4th, 5th, ...
  //     }
  //   };

  //   return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
  // };

  const completedQuest = questDataBySeason.completedQuests.find(
    (quest) => quest.puzzleNumber === parseInt(blockId, 10)
  );

  const settingQuestData = () => {
    console.log("completedQuest", completedQuest);
    setDoesCompletedQuestExist(true);
    setSelectedSeason(questDataBySeason.season);
    setPlant(completedQuest.plantName);
    setPlantId(completedQuest.plantId);

    const imageUrl = completedQuest.imageUrl;
    const fullImageUrl = imageUrl.startsWith("http")
      ? imageUrl
      : `https://${imageUrl}`;
    setImageBlob(fullImageUrl);
    setTextData(completedQuest.content);
    setToday(formatDate(completedQuest.completedAt));
    setMarkerPosition({
      latitude: completedQuest.latitude,
      longitude: completedQuest.longitude,
    });
    console.log("Formatted date:", today); //디버깅
  };

  // Check if there's a completed quest for this puzzleNumber
  useEffect(() => {
    if (completedQuest) {
      settingQuestData();
    } else {
      setDoesCompletedQuestExist(false);
      setPlant(translations.questStatus.selectPlant);
    }
  }, [blockId, questDataBySeason, completedQuest, translations]);

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
    setToday(formatDate(date));
  };

  const handleBtnClose = () => {
    setMarkerPosition(userLocation);
    console.log("marker position:", markerPosition);
    setIsMapOpen(false);
  };

  const handleCancelClick = (e) => {
    e.preventDefault(); // 기본 링크 동작을 막습니다.

    const confirmed = window.confirm(translations.questStatus.cancelConfirm);

    if (confirmed) {
      navigate("/"); // 사용자가 확인을 누르면 루트 페이지로 리디렉션합니다.
    }
  };

  //유효성검사
  const validateForm = () => {
    setIsPlantValid(
      !!plant && plant !== "Select a plant" && plant !== "식물 선택"
    );
    setIsTextValid(!!textData && textData.trim().length > 0);
    setIsQuestImageValid(!!imageBlob);
    setIsLocationValid(!!markerPosition.latitude && !!markerPosition.longitude);

    return isPlantValid && isTextValid && isQuestImageValid && isLocationValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // 폼 제출 기본 동작 방지
    setFormSubmitted(true);

    if (!validateForm()) {
      return;
    }

    try {
      // 서버에 보낼 데이터 준비
      const formData = new FormData();
      formData.append("selectedSeason", selectedSeason);
      formData.append("puzzleNumber", blockId);
      formData.append("plantId", plantId);
      formData.append("textData", textData);
      formData.append("today", today);
      formData.append("imageData", imageBlob);
      formData.append("markerLatitude", markerPosition.latitude);
      formData.append("markerLongitude", markerPosition.longitude);

      // FormData에 추가된 값 확인
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      // // 액세스 토큰 준비
      // const token = localStorage.getItem("accessToken"); // 또는 다른 방식으로 토큰을 가져옴

      // // fetch를 사용한 POST 요청
      // const response = await fetch(`${API_URL}/api/quests/complete`, {
      //   method: "POST",
      //   headers: {
      //     Authorization: `Bearer ${token}`, // 인증 헤더 추가
      //   },
      //   body: formData,
      // });

      const response = await fetchData(
        `${API_URL}/api/quests/complete`,
        "POST",
        language,
        formData
      );

      // const contentType = response.headers.get("Content-Type");
      // console.log("Response Content-Type:", contentType);

      console.log("Response from fetchData:", response);

      console.log("Response from fetchData:", response);

      if (response.ok) {
        setResponseMessage("Data submitted successfully!");
        console.log("Data received from fetchData:", response.data);
        navigate("/quest");
      } else {
        setResponseMessage(`Failed to submit data. Status: ${response.status}`);
        console.error("Server responded with an error:", response.data);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setResponseMessage("Error submitting data: " + error.message);
    }

    //   if (response.ok) {
    //     // 성공적으로 처리된 경우
    //     setResponseMessage("Data submitted successfully!");
    //     console.log("Data received from fetchData:", response);
    //     console.log("submit response ok:", response.ok);

    //     navigate("/quest");
    //     // 오류 처리
    //     setResponseMessage("Failed to submit data.");
    //   }
    // } catch (error) {
    //   console.error("Error submitting data:", error);
    //   setResponseMessage("Error submitting data: " + error.message);
    // }
  };

  // Update validation states when form fields change
  useEffect(() => {
    if (formSubmitted) {
      validateForm();
    }
  }, [plant, textData, imageBlob, markerPosition]);

  // 언어 변경 시 plant 상태 업데이트
  useEffect(() => {
    setPlant(translations.questStatus.selectPlant);
  }, [translations]);

  return (
    <>
      {isMapOpen ? (
        <>
          <BtnMapClose type="button" onClick={handleBtnClose}>
            {translations.questStatus.confirmLocation}
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
              <ImgContainer src={imageBlob} alt="Completed Quest Image" />
            ) : (
              <div>{translations.questStatus.noImgAvailable}</div>
            )}
          </PhotoCompletedQuest>
          <TitleWrapper>
            <PlantNameCompledtedQuest>{plant}</PlantNameCompledtedQuest>
            <DateCompletedQuest>
              {formatDate(completedQuest.completedAt)}
            </DateCompletedQuest>
          </TitleWrapper>

          <ContentCompletedQuest>{textData}</ContentCompletedQuest>

          <div></div>
        </CompletedQuestViewContainer>
      ) : (
        // 데이터가 없는 경우 폼 표시
        <QuestStatusForm onSubmit={handleSubmit}>
          <ButtonsContainer>
            <CancelBtnAndTextWrapper>
              <CancelBtnWrapper onClick={handleCancelClick}>
                <StyledIoMdClose />
              </CancelBtnWrapper>
              <div>{translations.questStatus.completedQuest}</div>
            </CancelBtnAndTextWrapper>

            <PostBtn type="submit">{translations.questStatus.submit}</PostBtn>
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
            markerPosition={markerPosition}
            isPlantValid={isPlantValid}
            setIsPlantValid={setIsPlantValid}
            isTextValid={isTextValid}
            isLocationValid={isLocationValid}
            setIsLocationValid={setIsLocationValid}
            formSubmitted={formSubmitted}
            setIsTextValid={setIsTextValid}
            currentTextLength={currentTextLength}
            setCurrentTextLength={setCurrentTextLength}
          />
          <CameraComponent
            imageBlob={imageBlob}
            setImageBlob={setImageBlob}
            onImageCapture={handleImageChange}
            isQuestImageValid={isQuestImageValid}
            setIsQuestImageValid={setIsQuestImageValid}
            formSubmitted={formSubmitted}
          />
          {isMapOpen && <StyledMapComponent />}
        </QuestStatusForm>
      )}
    </>
  );
};

export default QuestStatus;
