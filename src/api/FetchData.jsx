import { useLanguage } from "../helpers/languageUtils";
import { API_URL } from "./apiUrl";

//저장된 리프레시 토큰을 사용하여 새로운 액세스 토큰을 얻는 함수
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await fetch(`${API_URL}/api/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh access token");
  }

  const data = await response.json();
  const { accessToken } = data;

  localStorage.setItem("accessToken", accessToken);
  return accessToken;
}

export async function fetchData(url, method = "GET", body = null) {
  const { language, translations, changeLanguage } = useLanguage();
  let token = localStorage.getItem("accessToken");

  // 유효한 HTTP 메서드 값인지 확인
  const validMethods = ["GET", "POST", "PUT", "DELETE"];
  if (!validMethods.includes(method.toUpperCase())) {
    throw new Error(`Invalid HTTP method: ${method}`);
  }

  // FormData가 사용될 때와 JSON이 사용될 때를 구분
  const isFormData = body instanceof FormData; //???

  const options = {
    method: method.toUpperCase(),
    headers: {
      // JSON인 경우에만 Content-Type 헤더를 설정
      ...((method === "POST" || method === "PUT") && !isFormData
        ? { "Content-Type": "application/json" }
        : {}),
      Authorization: `Bearer ${token}`,
      // 언어 설정
      "Accept-Language": language === "en" ? "ENG" : "KOR",
    },
    credentials: "include", //서버에서 쿠키를 포함시키기 위한 설정??
  };

  if (body) {
    // FormData인 경우 그대로 설정, JSON 객체인 경우 문자열로 변환. options객체의 body속성에 할당한다.
    options.body = isFormData ? body : JSON.stringify(body);
  }

  // if (body) {
  //   if (isFormData) {
  //     options.body = body;
  //     // FormData를 사용할 때는 Content-Type을 설정하지 않습니다.
  //   } else {
  //     options.headers["Content-Type"] = "application/json";
  //     options.body = JSON.stringify(body);
  //   }
  // }

  console.log(`Fetching URL: ${url} with options:`, options);

  try {
    let response = await fetch(url, options);
    console.log("response", response);

    // 액세스 토큰이 만료된 경우
    if (response.status === 401) {
      try {
        token = await refreshAccessToken();
        options.headers.Authorization = `Bearer ${token}`;
        response = await fetch(url, options);
        console.log(`Response status after refresh: ${response.status}`); //for error checking
      } catch (error) {
        console.error("Failed to refresh access token:", error);
        throw error; // 토큰 갱신 실패 시 예외를 던져서 클라이언트 측에서 추가 처리하도록 할 수 있습니다.
      }
    }

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    //content-type 헤더를 확인하여 응답을 처리
    const contentType = response.headers.get("Content-Type");

    let parsedResponse;
    if (contentType && contentType.startsWith("application/json")) {
      parsedResponse = await response.json();
    } else if (contentType && contentType.startsWith("image/")) {
      parsedResponse = await response.blob();
    } else {
      parsedResponse = await response.text();
    }

    return {
      ok: response.ok,
      status: response.status,
      data: parsedResponse,
    };

    // if (contentType && contentType.startsWith("application/json")) {
    //   return response.json(); // JSON 응답을 처리
    // } else if (contentType && contentType.startsWith("image/")) {
    //   return response.blob(); // Blob 응답을 처리 (이미지, 파일 등)
    // } else {
    //   // 기타 응답 처리 (텍스트 등)
    //   return response.text();
    // }
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    throw error;
  }
}
