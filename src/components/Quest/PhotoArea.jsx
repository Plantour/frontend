import styled from "styled-components";
import { MdAddPhotoAlternate } from "react-icons/md";
import { useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";

// 앨범에서사진가져오기. 이 컴포넌트는 삭제예정

const PhotoAreaLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 75%;
  background-color: white;
`;

const PhotoInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 1 / 1; /*가로 세로 1:1 비율*/
  cursor: pointer;
  background-color: grey;
  position: relative;
`;

const DeleteBtn = styled.button`
  width: 30px;
  height: 30px;
  background-color: black;
  color: white;
  font-size: 1.25rem;
  font-weight: bold;
  border-radius: 50%;
  margin: 10px 10px 0 0;
  position: absolute;
  top: 0px;
  right: 0px;
  cursor: pointer;
`;

const StyledMdAddPhotoAlternate = styled(MdAddPhotoAlternate)`
  font-size: 3rem;
  color: white;
`;

const PhotoAddCmmt = styled.div`
  color: white;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const PhotoArea = ({ value, onChange }) => {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef();

  const handleContainerClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    console.log(event);
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0])); //미리보기 위한 임시 URL 생성
    }
  };

  const deleteBtnHandler = () => {
    setImage(null);
  };

  return (
    <PhotoAreaLayout>
      <PhotoInputContainer onClick={handleContainerClick}>
        {image ? (
          <>
            <DeleteBtn onClick={deleteBtnHandler}>
              <RxCross2 />
            </DeleteBtn>
            <img
              src={image}
              alt="Uploaded Preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </>
        ) : (
          <>
            <StyledMdAddPhotoAlternate />
            <PhotoAddCmmt>Please upload a photo of the plant.</PhotoAddCmmt>
          </>
        )}

        <HiddenFileInput
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
        />
      </PhotoInputContainer>
    </PhotoAreaLayout>
  );
};

export default PhotoArea;
