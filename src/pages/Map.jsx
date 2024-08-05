import styled from "styled-components";
import MapComponent from "../components/Map/MapComponent";

const MapLayout = styled.div`
  width: 100%;
  height: calc(
    100vh - 100px
  ); /* 100vh에서 Header와 Footer의 높이(50px씩)를 뺀 값 */
`;

const Map = () => {
  return (
    <MapLayout>
      <MapComponent />
    </MapLayout>
  );
};

export default Map;
