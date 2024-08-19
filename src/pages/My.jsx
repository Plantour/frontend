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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
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
    setIsAuthenticated(false);

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
          const response = await fetchData(
            `${API_URL}/api/auth/check-token`,
            "GET"
          );
          console.log("Access Token유효성검사:", response);

          if (response.data.valid) {
            setIsAuthenticated(true);

            // 첫 로그인 여부 및 닉네임 확인  //응답 데이터 키,값을 확인후 수정해야함.
            if (response.data.isFirstLogin) {
              setIsFirstLogin(true);
            } else {
              setNickname(response.data.nickname);
            }
          } else {
            handleSignOut();
          }
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
      {isAuthenticated ? (
        isFirstLogin ? (
          <h1>닉네임을 설정해주세요</h1>
        ) : (
          <h1>안녕하세요, {nickname}님!</h1>
        )
      ) : (
        <h1>로딩 중...</h1>
      )}
      <LogoutButton onClick={handleSignOut}>Sign Out</LogoutButton>
    </MyLayout>
  );
};

export default My;
