import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { API_URL } from "../../api/apiUrl";
import { fetchData } from "../../api/FetchData";

const GoogleOAuthCallbackLayout = styled.div`
  width: 100%;
  height: calc(
    100vh - 100px
  ); /* 100vh에서 Header와 Footer의 높이(50px씩)를 뺀 값 */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GoogleOAuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 비동기 함수 정의
    const fetchDataAndStoreTokens = async () => {
      try {
        // 쿼리 파라미터에서 'code' 값을 추출
        const params = new URLSearchParams(location.search);
        const code = params.get("code");

        console.log("OAuth code:", code);

        // 'code' 값이 존재할 때만 서버에 POST 요청을 보냄
        if (code) {
          // 액세스 토큰과 리프레시 토큰을 가져오기 위해 fetchData 호출
          // const response = await fetchData(
          //   `${API_URL}/api/auth/google`,
          //   "POST",
          //   { code: code }
          // );

          //테스트용 기본 fetch 코드
          const response = await fetch(
            "https://plantour.site/api/auth/google",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ code }),
            }
          );

          // 응답을 JSON으로 변환
          const data = await response.json();

          console.log("Server response:", response);

          // JWT 토큰 추출 및 저장
          const accessToken = data.accessToken;
          const refreshToken = data.refreshToken;
          console.log(
            "access token:",
            accessToken,
            "refresh token:",
            refreshToken
          );
          if (accessToken && refreshToken) {
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            console.log(
              "Stored accessToken:",
              localStorage.getItem("accessToken")
            );
            console.log(
              "Stored refreshToken:",
              localStorage.getItem("refreshToken")
            );
            // 저장 확인
            const storedAccessToken = localStorage.getItem("accessToken");
            const storedRefreshToken = localStorage.getItem("refreshToken");

            if (storedAccessToken && storedRefreshToken) {
              console.log("Tokens successfully stored in localStorage");

              // 저장 성공 확인 후 지연된 네비게이션
              setTimeout(() => {
                navigate("/my");
              }, 100); // 100ms 지연
            }
          } else {
            throw new Error("Failed to store tokens in localStorage");
          }

          // 인증 완료 후 '/my' 페이지로 리디렉션
          navigate("/my");
        }
      } catch (error) {
        console.error("Error during authentication", error);
      }
    };

    // 비동기 함수 호출
    fetchDataAndStoreTokens();
  }, [location, navigate]);

  return <GoogleOAuthCallbackLayout>Loading...</GoogleOAuthCallbackLayout>;
};

export default GoogleOAuthCallback;
