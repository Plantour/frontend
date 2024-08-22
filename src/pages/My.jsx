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

const EditButton = styled.button`
  margin-top: 10px;
  padding: 3px 10px;
  font-size: 1rem;
  border-radius: 20px;
  cursor: pointer;
`;

const NicknameInput = styled.input`
  margin-top: 10px;
  padding: 5px;
  font-size: 1rem;
  border-radius: 5px;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9rem;
  margin-top: 5px;
`;

const My = () => {
  const [nickname, setNickname] = useState("");
  const [editNickname, setEditNickname] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const { language, translations } = useLanguage();

  const handleSignOut = () => {
    console.log("Sign out triggered");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    //setIsAuthenticated(false);

    setTimeout(() => {
      navigate("/login");
    }, 100); // 100ms 지연
  };

  // 닉네임 수정 로직
  const handleEditNickname = () => {
    setIsEditing(true);
  };

  const validateNickname = (nickname) => {
    if (nickname.length < 3) {
      return "닉네임은 최소 3글자 이상이어야 합니다.";
    }
    if (nickname.length > 15) {
      return "닉네임은 최대 15글자까지 입력할 수 있습니다.";
    }
    return "";
  };

  const handleSaveNickname = async () => {
    const validationError = validateNickname(editNickname);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await fetchData(
        `${API_URL}/api/users/nickname`,
        "PUT",
        language,
        editNickname
      );
      console.log("닉네임 수정 응답:", response);
      setNickname(editNickname);
      setIsEditing(false);
    } catch (error) {
      console.error("닉네임 수정 중 오류 발생:", error);
    }
  };

  const handleBlur = () => {
    const validationError = validateNickname(editNickname);
    setError(validationError);
  };

  //access token의 유효성 검사, 사용자 정보 받기
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
  }, [accessToken, language]);

  return (
    <MyLayout>
      <h1>{translations.my.hello}</h1>

      <h1>
        {nickname}
        {language === "kr" && translations.my.title}
      </h1>
      {isEditing ? (
        <>
          <NicknameInput
            type="text"
            value={editNickname}
            onChange={(e) => setEditNickname(e.target.value)}
            onBlur={handleBlur} // 포커스가 벗어날 때 유효성 검사
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <EditButton onClick={handleSaveNickname}>저장</EditButton>
        </>
      ) : (
        <>
          <EditButton onClick={handleEditNickname}>닉네임 수정</EditButton>
        </>
      )}

      <LogoutButton onClick={handleSignOut}>Sign Out</LogoutButton>
    </MyLayout>
  );
};

export default My;
