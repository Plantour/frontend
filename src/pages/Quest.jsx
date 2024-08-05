import styled from "styled-components";
import Seasons from "../components/Quest/Seasons";
import Stamp from "../components/Quest/Stamp";
import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { questDataState, selectedSeasonState } from "../state/atom";
import { fetchData } from "../api/FetchData";
import { API_URL } from "../api/apiUrl";

const QuestLayout = styled.div`
  width: 100%;
  height: calc(
    100vh - 100px
  ); /* 100vh에서 Header와 Footer의 높이(50px씩)를 뺀 값 */
  background-color: white;
  position: relative;
`;

const Quest = () => {
  const [selectedSeason, setSelectedSeason] =
    useRecoilState(selectedSeasonState);
  const [animateId, setAnimateId] = useState(null);
  const [questDataBySeason, setQuestDataBySeason] =
    useRecoilState(questDataState);
  // const [questDataBySeason, setQuestDataBySeason] = useState();

  useEffect(() => {
    const fetchStamps = async () => {
      try {
        const data = await fetchData(
          `${API_URL}/api/quests?season=${selectedSeason}`,
          "GET"
        );
        if (data) {
          // 데이터가 있는 경우 상태 업데이트
          setQuestDataBySeason(data);
          console.log(data);
        } else {
          // 데이터가 없는 경우 상태 업데이트
          console.log("no data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchStamps();
    console.log(animateId);
  }, [selectedSeason]);

  // URL 쿼리 파라미터에서 animateId를 가져오는 로직
  const location = useLocation();
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("animateId");
    if (id) {
      setAnimateId(id);
    }
  }, [location.search]);

  return (
    <QuestLayout>
      <Seasons />
      <Stamp animateId={animateId} setAnimateId={setAnimateId} />
    </QuestLayout>
  );
};

export default Quest;
