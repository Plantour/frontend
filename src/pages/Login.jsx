import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { fetchData } from "../api/FetchData";
import { FcGoogle } from "react-icons/fc";
import { API_URL } from "../api/apiUrl";
import { useLanguage } from "../helpers/languageUtils";

const LoginLayout = styled.div`
  width: 100%;
  height: calc(
    100vh - 100px
  ); /* 100vh에서 Header와 Footer의 높이(50px씩)를 뺀 값 */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button`
  padding: 3px 10px;
  font-size: 1rem;
  border-radius: 20px;
  cursor: pointer;
`;

const Login = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const { language } = useLanguage();

  //access token의 유효성 검사 로직 (footer클릭시 토큰여부를 검사하지만 url로 바로 접속할경우를 위해서..)
  useEffect(() => {
    const checkAuthentication = async () => {
      if (accessToken) {
        try {
          //fetchData응답형태수정함
          const response = await fetchData(
            `${API_URL}/api/auth/check-token`,
            "GET",
            language
          );
          if (response.data.valid) {
            setIsAuthenticated(true);
            console.log("유효성검사 true");
            navigate("/my");
          } else {
            console.log("유효성검사 false");
          }
        } catch (error) {
          console.error("Error validating token:", error);
          //handleSignOut();
        }
      }
      if (!accessToken) {
        console.log("no accessToken");
        //handleSignOut();
      }
    };

    checkAuthentication();
  }, []);

  const redirectToGoogleSSO = () => {
    const clientId = import.meta.env.VITE_GOOGLE_OAUTH_KEY_CLIENT_ID;
    const redirectUri = `${API_URL}/oauth/callback`;
    const scope = "openid profile email";
    const responseType = "code"; //인가 코드(authorization code)를 받는다.
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}`;

    window.location.href = authUrl;
  };

  // const handleSignOut = () => {
  //   localStorage.removeItem("accessToken");
  //   localStorage.removeItem("refreshToken");
  //   setIsAuthenticated(false);
  // };

  return (
    <LoginLayout>
      {/* 원래 로그인페이지에서는 signout이 안보여야함(토큰있음 my로 넘어가니까) */}

      <Button onClick={redirectToGoogleSSO}>
        <FcGoogle />
        Sign In with Google
      </Button>
    </LoginLayout>
  );
};

export default Login;
