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
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const logoutBtnClickHandler = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSignOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
  };

  const redirectToGoogleSSO = () => {
    const clientId = import.meta.env.VITE_GOOGLE_OAUTH_KEY_CLIENT_ID;
    const redirectUri = "http://localhost:5173/oauth/callback"; //배포후 변경 필요
    const scope = "openid profile email";
    const responseType = "code"; //인가 코드(authorization code)를 받는다.
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}`;

    window.location.href = authUrl;
  };

  //access token의 유효성 검사 로직
  useEffect(() => {
    const checkAuthentication = async () => {
      console.log("tryingfetch");
      if (accessToken) {
        try {
          const response = await fetchData(
            `${API_URL}/api/auth/check-token`,
            "GET"
          );
          console.log("accesstoken유효성검사:", response);
          if (response.valid) {
            setIsAuthenticated(true);
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
      <h1>My Page</h1>
      {/* My 원래 마이페이지에서는 signIn이 안보여야함(토큰없음 login으로
      넘어가니까) */}
      <LogoutButton onClick={logoutBtnClickHandler}>Sign Out</LogoutButton>
    </MyLayout>
  );
};

export default My;
