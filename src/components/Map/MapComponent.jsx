import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  LoadScriptNext,
  GoogleMap,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import {
  mockDataforMapComponent,
  mockDataPlantNote,
  mockMarkerPositions,
} from "../../list/mockData";
import { fetchData } from "../../api/FetchData";
import { API_URL } from "../../api/apiUrl";
import MapModal from "./MapModal";
import { useRecoilState } from "recoil";
import { userLocationState } from "../../state/atom";

const MapContainer = styled.div`
  width: 100%;
  height: calc(100vh - 100px);
  position: relative;
`;

const SearchBoxContainer = styled.div`
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  width: 250px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  text-indent: 10px; /* 텍스트를 왼쪽에서 10px 들여쓰기 */
`;

// 컴포넌트 외부에 libraries 배열을 정의
const libraries = ["places"];

export default function MapComponent({ markerPosition, setMarkerPosition }) {
  const [userLocation, setUserLocation] = useRecoilState(userLocationState);
  const [fetchedData, setFetchedData] = useState(mockDataforMapComponent); //식물위치마커들(퀘스트)
  const [plantNoteFetchedData, setPlantNoteFetchedData] =
    useState(mockDataPlantNote); //식물위치마커들(plantNote)

  const [showModal, setShowModal] = useState(false);
  const [selectedMarkerData, setSelectedMarkerData] = useState(null);
  const mapRef = useRef(null);
  const searchBoxRef = useRef(null);
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY;

  // 사용자 위치 정보를 백엔드로 전송하고 주변 마커를 받아오는 함수 (퀘스트데이터)
  const fetchMarkers = async (latitude, longitude) => {
    try {
      const url = `${API_URL}/api/quests/nearby?latitude=${latitude}&longitude=${longitude}`;

      const response = await fetchData(url);

      console.log("fetched data:", response);
      setFetchedData(response.data); // 받은 마커 데이터를 상태로 설정. 이부분맞는지확인필요
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // 사용자 위치 정보를 백엔드로 전송하고 주변 마커를 받아오는 함수 (plant note 데이터)
  const plantNoteFetchMarkers = async (latitude, longitude) => {
    try {
      const url = `${API_URL}/api/plant-notes/nearby?latitude=${latitude}&longitude=${longitude}`;

      const response = await fetchData(url);

      console.log("plantNoteFetchedDatafetched data:", response);
      setPlantNoteFetchedData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // 사용자의 위치정보 받아오기
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        const success = (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setUserLocation({
            latitude: latitude,
            longitude: longitude,
          });
          fetchMarkers(latitude, longitude); //사용자의 현재 위치정보 받아온 후 백엔드로 전송
          plantNoteFetchMarkers(latitude, longitude);
        };

        const error = (error) => {
          console.error("Error getting user's position:", error);
        };

        const options = {
          enableHighAccuracy: true, // 높은 정확도 사용 요청
          timeout: 5000, // 요청 타임아웃 설정 (ms)
          maximumAge: 0, // 캐시된 위치 정보 사용하지 않음
        };

        navigator.geolocation.getCurrentPosition(success, error, options);
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    getLocation();
  }, []);

  const handleMarkerClick = (quest) => {
    setSelectedMarkerData(quest);
    setShowModal(true);
  };

  return (
    <MapContainer>
      <LoadScriptNext googleMapsApiKey={googleMapsApiKey} libraries={libraries}>
        <SearchBoxContainer>
          <Autocomplete
            onLoad={(autocomplete) => {
              searchBoxRef.current = autocomplete;
            }}
            onPlaceChanged={() => {
              const place = searchBoxRef.current.getPlace();
              if (place.geometry && place.geometry.location) {
                const newLat = place.geometry.location.lat();
                const newLng = place.geometry.location.lng();
                setUserLocation({
                  latitude: newLat,
                  longitude: newLng,
                });
                setMarkerPosition({ latitude: newLat, longitude: newLng });
                if (mapRef.current) {
                  mapRef.current.panTo({ lat: newLat, lng: newLng });
                }
              }
            }}
          >
            <SearchInput type="text" placeholder="Search for places..." />
          </Autocomplete>
        </SearchBoxContainer>
        <GoogleMap
          mapContainerStyle={{ height: "calc(100vh - 100px)", width: "100%" }}
          center={{ lat: userLocation.latitude, lng: userLocation.longitude }}
          zoom={14}
          onClick={(event) => {
            const newLat = event.latLng.lat();
            const newLng = event.latLng.lng();
            setUserLocation({
              latitude: newLat,
              longitude: newLng,
            });
            setMarkerPosition({ latitude: newLat, longitude: newLng });
          }}
          onLoad={(map) => {
            mapRef.current = map;
          }}
        >
          {/* quest 마커 */}
          {fetchedData.nearbyQuests.map((quest, index) => (
            <Marker
              key={index}
              position={{
                lat: quest.latitude,
                lng: quest.longitude,
              }}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/ltblue-dot.png",
              }}
              onClick={() => handleMarkerClick(quest)}
            />
          ))}
          {/* plant note 마커 */}
          {plantNoteFetchedData.nearbyPlantNotes.map((note, index) => (
            <Marker
              key={index}
              position={{
                lat: note.latitude,
                lng: note.longitude,
              }}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/purple-dot.png",
              }}
              onClick={() => handleMarkerClick(note)}
            />
          ))}
          {/* 사용자 위치 마커 */}
          <Marker
            position={{
              lat: userLocation.latitude,
              lng: userLocation.longitude,
            }}
          />
        </GoogleMap>
      </LoadScriptNext>
      <MapModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        markerData={selectedMarkerData}
      />
    </MapContainer>
  );
}

// import React, { useEffect, useRef, useState } from "react";
// import styled from "styled-components";
// import {
//   LoadScriptNext,
//   GoogleMap,
//   Marker,
//   Autocomplete,
// } from "@react-google-maps/api";
// import { mockMarkerPositions } from "../../list/mockData";
// import { fetchData } from "../../api/FetchData";
// import { API_URL } from "../../api/apiUrl";

// const MapContainer = styled.div`
//   width: 100%;
//   height: calc(100vh - 100px);
// `;

// const SearchBoxContainer = styled.div`
//   position: absolute;
//   top: 120px;
//   left: 50%;
//   transform: translateX(-50%);
//   z-index: 1;
//   width: 250px;
//   border-radius: 50%;
//   box-sizing: border-box;
// `;

// const SearchInput = styled.input`
//   width: 100%;
//   padding: 10px;
//   font-size: 16px;
// `;

// // 컴포넌트 외부에 libraries 배열을 정의
// const libraries = ["places"];

// export default function MapComponent({ markerPosition, setMarkerPosition }) {
//   const [userLocation, setUserLocation] = useState({
//     latitude: 51.51107406616211,
//     longitude: -0.11715872585773468,
//   });
//   const [markerPositions, setMarkerPositions] = useState(mockMarkerPositions); //식물위치마커들
//   const mapRef = useRef(null);
//   const searchBoxRef = useRef(null);
//   const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY;

//   const isValidMarkerData = (data) => {
//     return (
//       Array.isArray(data.markers) &&
//       data.markers.every(
//         (marker) =>
//           typeof marker.lat === "number" && typeof marker.lng === "number"
//       )
//     );
//   };

//   // 사용자 위치 정보를 백엔드로 전송하고 주변 마커를 받아오는 함수
//   const fetchMarkers = async (latitude, longitude) => {
//     try {

//       const url = `${API_URL}/api/quests/nearby?latitude=${latitude}&longitude=${longitude}`;

//       const data = await fetchData(url);

//       // 데이터 변환: {lng: ..., lat: ...} -> {lat: ..., lng: ...}
//       const transformedData = data.map((marker) => ({
//         lat: marker.lat,
//         lng: marker.lng,
//       }));

//       console.log("fetched markers:", transformedData);
//       setMarkerPositions(transformedData); // 받은 마커 데이터를 상태로 설정. 이부분맞는지확인필요
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   // 사용자의 위치정보 받아오기
//   useEffect(() => {
//     const getLocation = () => {
//       if (navigator.geolocation) {
//         const success = (position) => {
//           const latitude = position.coords.latitude;
//           const longitude = position.coords.longitude;
//           setUserLocation({
//             latitude: latitude,
//             longitude: longitude,
//           });
//           fetchMarkers(latitude, longitude); //사용자의 현재 위치정보 받아온 후 백엔드로 전송
//         };

//         const error = (error) => {
//           console.error("Error getting user's position:", error);
//         };

//         const options = {
//           enableHighAccuracy: true, // 높은 정확도 사용 요청
//           timeout: 5000, // 요청 타임아웃 설정 (ms)
//           maximumAge: 0, // 캐시된 위치 정보 사용하지 않음
//         };

//         navigator.geolocation.getCurrentPosition(success, error, options);
//       } else {
//         console.error("Geolocation is not supported by this browser.");
//       }
//     };

//     getLocation();
//   }, []);

//   return (
//     <MapContainer>
//       <LoadScriptNext googleMapsApiKey={googleMapsApiKey} libraries={libraries}>
//         <SearchBoxContainer>
//           <Autocomplete
//             onLoad={(autocomplete) => {
//               searchBoxRef.current = autocomplete;
//             }}
//             onPlaceChanged={() => {
//               const place = searchBoxRef.current.getPlace();
//               if (place.geometry && place.geometry.location) {
//                 const newLat = place.geometry.location.lat();
//                 const newLng = place.geometry.location.lng();
//                 setUserLocation({
//                   latitude: newLat,
//                   longitude: newLng,
//                 });
//                 setMarkerPosition({ latitude: newLat, longitude: newLng });
//                 if (mapRef.current) {
//                   mapRef.current.panTo({ lat: newLat, lng: newLng });
//                 }
//               }
//             }}
//           >
//             <SearchInput type="text" placeholder="Search for places..." />
//           </Autocomplete>
//         </SearchBoxContainer>
//         <GoogleMap
//           mapContainerStyle={{ height: "calc(100vh - 100px)", width: "100%" }}
//           center={{ lat: userLocation.latitude, lng: userLocation.longitude }}
//           zoom={14}
//           onClick={(event) => {
//             const newLat = event.latLng.lat();
//             const newLng = event.latLng.lng();
//             setUserLocation({
//               latitude: newLat,
//               longitude: newLng,
//             });
//             setMarkerPosition({ latitude: newLat, longitude: newLng });
//           }}
//           onLoad={(map) => {
//             mapRef.current = map;
//           }}
//         >
//           {/* 식물위치 마커들 */}
//           {/* {markerPositions.map((position, index) => {
//             // 콘솔에 현재 marker의 위치를 출력합니다.
//             console.log("Marker position:", position);

//             return (
//               <Marker
//                 key={index}
//                 position={position}
//                 icon={{
//                   url: "http://maps.google.com/mapfiles/ms/icons/ltblue-dot.png",
//                 }}
//               />
//             );
//           })} */}

//           {markerPositions.map((position, index) => (
//             <Marker
//               key={index}
//               position={position}
//               icon={{
//                 url: "http://maps.google.com/mapfiles/ms/icons/ltblue-dot.png",
//               }}
//             />
//           ))}
//           {/* 사용자 위치 마커 */}
//           <Marker
//             position={{
//               lat: userLocation.latitude,
//               lng: userLocation.longitude,
//             }}
//           />
//         </GoogleMap>
//       </LoadScriptNext>
//     </MapContainer>
//   );
// }
