import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  LoadScriptNext,
  GoogleMap,
  Marker,
  Autocomplete,
  Circle,
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
import { useLanguage } from "../../helpers/languageUtils";

const MapContainer = styled.div`
  width: 100%;
  height: calc(100vh - 100px);
  position: relative;
`;

const SearchBoxContainer = styled.div`
  position: absolute;
  top: 10px;
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
  const { translations, language } = useLanguage();
  const [userLocation, setUserLocation] = useRecoilState(userLocationState);
  const [fetchedData, setFetchedData] = useState(mockDataforMapComponent); //식물위치마커들(퀘스트)
  const [plantNoteFetchedData, setPlantNoteFetchedData] =
    useState(mockDataPlantNote); //식물위치마커들(plantNote)

  const [showModal, setShowModal] = useState(false);
  const [selectedMarkerData, setSelectedMarkerData] = useState(null);
  const mapRef = useRef(null);
  const searchBoxRef = useRef(null);
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY;
  const [circleOptions, setCircleOptions] = useState({
    strokeColor: "white",
    strokeOpacity: 0.8,
    strokeWeight: 4,
    fillColor: "yellowgreen",
    fillOpacity: 0.1,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 1000,
    zIndex: 1,
  });

  // 사용자 위치 정보를 백엔드로 전송하고 주변 마커를 받아오는 함수 (퀘스트데이터)
  const fetchMarkers = async (latitude, longitude) => {
    try {
      const url = `${API_URL}/api/quests/nearby?latitude=${latitude}&longitude=${longitude}`;

      const response = await fetchData(url, "GET", language);

      console.log("Quest fetched data:", response);
      setFetchedData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // 사용자 위치 정보를 백엔드로 전송하고 주변 마커를 받아오는 함수 (plant note 데이터)
  const plantNoteFetchMarkers = async (latitude, longitude) => {
    try {
      const url = `${API_URL}/api/plant-notes/nearby?latitude=${latitude}&longitude=${longitude}`;

      const response = await fetchData(url, "GET", language);

      console.log("plantNote Fetched data:", response);
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
            <SearchInput
              type="text"
              placeholder={translations.mapComponent.searchPlaces}
            />
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
          options={{
            mapTypeControl: false, // 맵 타입 컨트롤을 숨김
            language: language === "kr" ? "ko" : "en", //언어설정 적용 안되는듯..
          }}
        >
          <Circle
            center={{
              lat: userLocation.latitude,
              lng: userLocation.longitude,
            }}
            options={circleOptions}
          />

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
