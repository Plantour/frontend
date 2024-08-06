import React from "react";
import styled from "styled-components";
import { IoCloseCircleOutline } from "react-icons/io5";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 10px;
  border-radius: 8px;
  width: 300px;
  height: 430px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`;

const SectionTopContainer = styled.div`
  width: 100%;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 0;
  right: 0;
`;

const SectionTopLeft = styled.span`
  display: flex;
  flex-direction: column;
  align-items: start;
  margin-left: 10px;
`;

const StyledIoCloseCircleOutline = styled(IoCloseCircleOutline)`
  font-size: 2rem;
  color: grey;
`;

const Img = styled.img`
  width: 300px;
  height: 300px;
`;

const Title = styled.h4`
  text-align: left;
`;

const Content = styled.p`
  text-align: left;
`;

const MapModal = ({ showModal, onClose, markerData }) => {
  if (!showModal) {
    return null;
  }

  //시간데이터에서 년도, 월, 일 추출하기
  // 주어진 날짜 문자열

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

  return (
    <ModalOverlay>
      <ModalContent>
        <SectionTopContainer onClick={onClose}>
          <SectionTopLeft>
            <div>{markerData.userName}</div>
            <div>{showDDMMYY(markerData.createdAt)}</div>
          </SectionTopLeft>
          <StyledIoCloseCircleOutline />
        </SectionTopContainer>
        <Img src={markerData.imageUrl} alt="plant image"></Img>

        <Title>
          {markerData.plantName && <span>{markerData.plantName}</span>}
          {markerData.title && <span>{markerData.title}</span>}
        </Title>
        <Content>{markerData.content}</Content>
      </ModalContent>
    </ModalOverlay>
  );
};

export default MapModal;
