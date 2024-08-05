import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const LoginLayout = styled.div`
  width: 100%;
  height: calc(
    100vh - 100px
  ); /* 100vh에서 Header와 Footer의 높이(50px씩)를 뺀 값 */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Login = () => {
  const accessToken = localStorage.getItem("accessToken");

  const redirectToGoogleSSO = () => {
    const clientId = import.meta.env.VITE_GOOGLE_OAUTH_KEY_CLIENT_ID;
    const redirectUri = "http://localhost:5173/oauth/callback"; //배포후 변경 필요
    const scope = "openid profile email";
    const responseType = "code"; //인가 코드(authorization code)를 받는다.
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}`;

    window.location.href = authUrl;
  };

  const handleSignOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  return (
    <LoginLayout>
      {accessToken ? (
        <button onClick={handleSignOut}>Sign Out</button>
      ) : (
        <button onClick={redirectToGoogleSSO}>Sign In with Google</button>
      )}
    </LoginLayout>
  );
};

export default Login;
