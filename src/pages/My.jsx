import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { fetchData } from "../api/FetchData";
import { API_URL } from "../api/apiUrl";

const MyLayout = styled.div`
  width: 100%;
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const LogoutButton = styled.button`
  padding: 3px 10px;
  font-size: 1rem;
  border-radius: 20px;
  cursor: pointer;
`;

const My = () => {
  //const [isAuthenticated, setIsAuthenticated] = useState(false);
  //const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [nickname, setNickname] = useState("");
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  // const logoutBtnClickHandler = () => {
  //   localStorage.removeItem("token");
  //   navigate("/login");
  // };

  const handleSignOut = () => {
    console.log("Sign out triggered");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    //setIsAuthenticated(false);

    setTimeout(() => {
      navigate("/login");
    }, 100); // 100ms 지연
  };

  //access token의 유효성 검사 로직
  useEffect(() => {
    const checkAuthentication = async () => {
      if (accessToken) {
        try {
          //fetchData응답형태수정함
          const response = await fetchData(`${API_URL}/api/users/my`, "GET");
          console.log("Access Token유효성검사:", response);

          // if (response.data.valid) {
          //   setIsAuthenticated(true);

          setNickname(
            response.data.customNickname
              ? response.data.customNickname
              : response.data.nickname
          );

          // } else {
          //   handleSignOut();
          // }
        } catch (error) {
          console.error("Error validating token:", error);
          handleSignOut();
        }
      }
    };
    checkAuthentication();
  }, []);

  return (
    <MyLayout>
      <h1>안녕하세요, {nickname}님!</h1>

      <LogoutButton onClick={handleSignOut}>Sign Out</LogoutButton>
    </MyLayout>
  );
};

export default My;
