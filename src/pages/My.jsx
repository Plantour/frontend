import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const MyLayout = styled.div`
  width: 100%;
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const LogoutButton = styled.button``;

const My = () => {
  const navigate = useNavigate();
  const logoutBtnClickHandler = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <MyLayout>
      My
      <LogoutButton onClick={logoutBtnClickHandler}>Logout</LogoutButton>
    </MyLayout>
  );
};

export default My;
