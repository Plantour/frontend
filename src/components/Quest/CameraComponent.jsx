import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { MdAddAPhoto } from "react-icons/md";

const CameraComponentLayout = styled.div`
  position: relative;
  height: 70%;
`;

const VideoOrPhotoContainer = styled.div`
  height: 100%;
`;

const Video = styled.video`
  width: 100%;
  aspect-ratio: 1/1; /*width에 맞춰서 정사각형 만들기*/
  background-color: grey; /*카메라가 꺼졌을때 배경색*/
  object-fit: cover; /*비디오 스트림이 컨테이너를 완전히 덮도록 하며, 비율이 맞지 않는 부분은 잘림, 여백없는 정사각형 스트림 위함*/
`;

const ButtonsContainer = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Canvas = styled.canvas`
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
`;

const ButtonOpenCamera = styled.button`
  position: absolute;
  top: 130px;
  left: 140px;
  z-index: 10;
  font-size: 1rem;
  background-color: grey;
  border: none;
  color: white;
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

const CameraComponent = ({ onImageCapture, imageBlob, setImageBlob }) => {
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const getVideo = (event) => {
    event.preventDefault();
    navigator.mediaDevices
      .getUserMedia({ video: true })
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
    const width = 400;
    const height = 300;

    let video = videoRef.current;
    let photo = photoRef.current;

    photo.width = width;
    photo.height = height;

    let ctx = photo.getContext("2d");
    ctx.drawImage(video, 0, 0, width, height);
    setHasPhoto(true);

    //   // Convert canvas image to data URL
    //   const imageDataURL = photo.toDataURL("image/jpeg");
    //   onImageCapture(imageDataURL); // Callback to parent component
    // };

    // Convert canvas image to Blob
    photo.toBlob((blob) => {
      console.log("Captured image blob:", blob); // 블랍 확인용
      onImageCapture(blob); // Callback to parent component with Blob
    }, "image/jpeg"); // MIME type 지정
  };

  const clearPhoto = () => {
    let photo = photoRef.current;
    let ctx = photo.getContext("2d");
    ctx.clearRect(0, 0, photo.width, photo.height);
    setHasPhoto(false);
  };
  // return (
  //   <CameraComponentLayout>
  //     <VideoOrPhotoContainer>
  //       <div>
  //         {/* 조건부 렌더링을 통해 비디오 스트림 또는 캡처된 사진을 표시 */}
  //         {!hasPhoto ? (
  //           <Video ref={videoRef}></Video>
  //         ) : (
  //           <Canvas ref={photoRef}></Canvas>
  //         )}
  //         <ButtonsContainer>
  //           {!isCameraOpen && (
  //             <ButtonOpenCamera onClick={getVideo}>
  //               <StyledMdAddAPhoto />
  //               <div>Add photo</div> {/* 카메라 열기 */}
  //             </ButtonOpenCamera>
  //           )}
  //           {isCameraOpen && !hasPhoto && (
  //             <ButtonTakePhoto onClick={takePhoto}>Take Photo</ButtonTakePhoto>
  //           )}
  //         </ButtonsContainer>
  //       </div>
  //     </VideoOrPhotoContainer>

  //     <div>{hasPhoto && <button onClick={clearPhoto}>Clear Photo</button>}</div>
  //   </CameraComponentLayout>
  // );

  return (
    <CameraComponentLayout>
      <div>
        <Video ref={videoRef}></Video>
        <ButtonsContainer>
          {!isCameraOpen && (
            <ButtonOpenCamera onClick={getVideo}>
              <StyledMdAddAPhoto />
              <div>Add photo</div> {/*open camera*/}
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
      </div>
      <div>
        <Canvas ref={photoRef}></Canvas>
      </div>
    </CameraComponentLayout>
  );
};

export default CameraComponent;
