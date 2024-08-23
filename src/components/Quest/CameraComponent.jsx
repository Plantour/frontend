import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { MdAddAPhoto } from "react-icons/md";

const CameraComponentLayout = styled.div`
  width: 100%;
  position: relative;
  height: 70%;
`;

const VideoOrPhotoContainer = styled.div`
  position: relative;
`;

const Video = styled.video`
  width: 100%;
  aspect-ratio: 1/1; /*width에 맞춰서 정사각형 만들기*/
  background-color: grey; /*카메라가 꺼졌을때 배경색*/
  object-fit: cover; /*비디오 스트림이 컨테이너를 완전히 덮도록 하며, 비율이 맞지 않는 부분은 잘림, 여백없는 정사각형 스트림 위함*/
`;

const Canvas = styled.canvas`
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
`;

const ButtonsContainer = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonOpenCamera = styled.button`
  position: absolute;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
  z-index: 10;
  font-size: 1rem;
  background-color: grey;
  border: none;
  color: ${(props) => (props.isValid ? "white" : "#ff6347")};
  cursor: pointer;
`;

const StyledMdAddAPhoto = styled(MdAddAPhoto)`
  font-size: 3rem;
`;

const ButtonTakePhoto = styled.button`
  width: 45px;
  height: 45px;
  background-color: black;
  color: white;
  border-radius: 50%;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease-in;
  margin: 5px 0;
  &:hover {
    width: 48px;
    height: 48px;
  }
`;

const ButtonClearPhoto = styled.button`
  width: 45px;
  height: 45px;
  background-color: grey;
  color: white;
  border-radius: 50%;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease-in;
  margin: 5px 0;
  &:hover {
    width: 48px;
    height: 48px;
  }
`;

const CameraComponent = ({
  onImageCapture,
  imageBlob,
  setImageBlob,
  isQuestImageValid,
  setIsQuestImageValid,
  isPlantNoteImageValid,
  formSubmitted,
  setIsPlantNoteImageValid,
}) => {
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const getVideo = (event) => {
    event.preventDefault();

    const isMobileDevice = /Mobi|Android/i.test(navigator.userAgent); // 모바일 기기인지 확인
    const facingMode = isMobileDevice ? "environment" : "user"; // 모바일이면 전면 카메라, 아니면 사용자 카메라

    const constraints = {
      video: {
        facingMode: facingMode,
      },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
        setIsCameraOpen(true);
      })
      .catch((err) => {
        console.error("Error accessing the camera: ", err);
      });
  };

  const takePhoto = (event) => {
    event.preventDefault();
    const width = 375;
    const height = 375;

    let video = videoRef.current;
    let photo = photoRef.current;

    photo.width = width;
    photo.height = height;

    let ctx = photo.getContext("2d");

    // Calculate aspect ratio
    const aspectRatio = video.videoWidth / video.videoHeight;

    let drawWidth, drawHeight, startX, startY;

    if (aspectRatio > 1) {
      // Landscape orientation
      drawHeight = height;
      drawWidth = video.videoWidth * (height / video.videoHeight);
      startX = (width - drawWidth) / 2;
      startY = 0;
    } else {
      // Portrait or square orientation
      drawWidth = width;
      drawHeight = video.videoHeight * (width / video.videoWidth);
      startX = 0;
      startY = (height - drawHeight) / 2;
    }

    // Clear the canvas before drawing
    ctx.clearRect(0, 0, width, height);

    // Draw the image
    ctx.drawImage(video, startX, startY, drawWidth, drawHeight);

    setHasPhoto(true);

    // Convert canvas image to Blob
    photo.toBlob((blob) => {
      console.log("Captured image blob:", blob); // 블랍 확인용
      onImageCapture(blob); // Callback to parent component with Blob
      if (formSubmitted) {
        // Validate image on capture after form submission
        setIsQuestImageValid(!!blob);
      }
    }, "image/jpeg"); // MIME type 지정
  };

  const clearPhoto = () => {
    let photo = photoRef.current;
    let ctx = photo.getContext("2d");
    ctx.clearRect(0, 0, photo.width, photo.height);
    setHasPhoto(false);
  };

  return (
    <CameraComponentLayout>
      <VideoOrPhotoContainer>
        <Video ref={videoRef}></Video>
        <ButtonsContainer>
          {!isCameraOpen && (
            <ButtonOpenCamera
              onClick={getVideo}
              isValid={!formSubmitted || isQuestImageValid}
            >
              <StyledMdAddAPhoto />
            </ButtonOpenCamera>
          )}
          {isCameraOpen && !hasPhoto && (
            <ButtonTakePhoto onClick={takePhoto}>Take Photo</ButtonTakePhoto>
          )}
          {isCameraOpen && hasPhoto && (
            <ButtonClearPhoto onClick={clearPhoto}>
              Clear Photo
            </ButtonClearPhoto>
          )}
        </ButtonsContainer>
      </VideoOrPhotoContainer>
      <div>
        <Canvas ref={photoRef}></Canvas>
      </div>
    </CameraComponentLayout>
  );
};

export default CameraComponent;
