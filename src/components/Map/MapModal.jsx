import React from "react";
import styled from "styled-components";

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
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  height: 350px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const CloseButton = styled.button`
  background: red;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  margin-top: 20px;
`;

const MapModal = ({ showModal, onClose, markerData }) => {
  if (!showModal) {
    return null;
  }

  return (
    <ModalOverlay>
      <ModalContent>
        <div>
          <span>Plant Name: {markerData.plantName}</span>
          <span>By {markerData.userName}</span>
        </div>
        <img src={markerData.imageUrl} alt="plant image" />
        <p>{markerData.content}</p>
        <CloseButton onClick={onClose}>Close</CloseButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default MapModal;
