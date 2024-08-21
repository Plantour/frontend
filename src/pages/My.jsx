import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { fetchData } from "../api/FetchData";
import { API_URL } from "../api/apiUrl";
import { useLanguage } from "../helpers/languageUtils";

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
  const { language } = useLanguage();

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
          const response = await fetchData(
            `${API_URL}/api/users/my`,
            "GET",
            language,
            null
          );
          console.log("Access Token유효성검사:", response);

          setNickname(
            response.data.customNickname
              ? response.data.customNickname
              : response.data.nickname
          );
        } catch (error) {
          console.error("Error validating token:", error);
          //handleSignOut(); //나중에 다시 활성화?
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
