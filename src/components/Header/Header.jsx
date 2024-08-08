import styled from "styled-components";
import { LiaSmileSolid } from "react-icons/lia";
import { LiaSmileWink } from "react-icons/lia";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Layout = styled.div`
  height: 50px;
  background-color: ivory;
  display: flex;
  align-items: center;
  justify-content: end;
`;

const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100%;
  color: black;
  font-size: 0.625rem;
  font-weight: bold;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
`;

const Circle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: transparent;
  transition: all 0.3s ease-in-out;
  /* 부모요소의 중앙에 위치시키기 */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  ${IconContainer}:hover & {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background-color: lightgoldenrodyellow;
    opacity: 1; /* Show circle on hover */
  }
`;

const IconTextWrapper = styled(Link)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-decoration: none; /*밑줄제거 */
  color: inherit; /*기본색상상속*/
`;

const StyledLiaSmileSolid = styled(LiaSmileSolid)`
  width: 1.5rem;
  height: 1.5rem;
`;

const StyledLiaSmileWink = styled(LiaSmileWink)`
  width: 1.5rem;
  height: 1.5rem;
`;

const Header = () => {
  const [isMyHovered, setIsMyHovered] = useState(false);
  const navigate = useNavigate();

  //로그인 여부를 확인하는 로직 (로컬 스토리지에서 토큰 확인)
  const checkLogin = () => {
    const accessToken = localStorage.getItem("accessToken");
    console.log("acceess token:", accessToken);
    return accessToken ? true : false;
  };

  const handleClick = (e) => {
    e.preventDefault(); // 기본 링크 동작을 막음
    if (checkLogin()) {
      navigate("/my");
    } else {
      navigate("/login");
    }
  };

  return (
    <Layout>
      <IconContainer>
        <Circle />
        <IconTextWrapper
          onClick={handleClick}
          onMouseEnter={() => setIsMyHovered(true)}
          onMouseLeave={() => setIsMyHovered(false)}
        >
          {isMyHovered ? <StyledLiaSmileWink /> : <StyledLiaSmileSolid />}
          <div>MY</div>
        </IconTextWrapper>
      </IconContainer>
    </Layout>
  );
};

export default Header;
