import { atom, selector } from "recoil";

//현재 날짜에 따라 시즌을 계산하는 Selector
const currentSeasonSelector = selector({
  key: "currentSeasonSelector",
  get: () => {
    const month = new Date().getMonth() + 1; // getMonth()는 0부터 시작하므로 +1
    if (month >= 3 && month <= 5) {
      return "SPRING";
    } else if (month >= 6 && month <= 8) {
      return "SUMMER";
    } else if (month >= 9 && month <= 11) {
      return "AUTUMN";
    } else {
      return "WINTER";
    }
  },
});

export const selectedSeasonState = atom({
  key: "selectedSeasonState",
  default: currentSeasonSelector, //기본값을 currentSeasonSelector로 설정
});

//Quest 컴포넌트에서 시즌 선택시마다 받아오게 되는 데이터
export const questDataState = atom({
  key: "questDataState",
  default: {
    //default로 mockdata넣음
    quest: {
      name: "Spring Mission",
      season: "SPRING",
      id: 1,
    },
    plantData: {
      plants: [
        {
          imgUrl:
            "https://upload.wikimedia.org/wikipedia/ko/thumb/e/e2/%EC%84%9C%EC%9A%B8%EC%8B%9C%EC%A7%80%EC%8B%9D%EA%B3%B5%EC%9C%A0115.JPG/300px-%EC%84%9C%EC%9A%B8%EC%8B%9C%EC%A7%80%EC%8B%9D%EA%B3%B5%EC%9C%A0115.JPG",
          characteristics: [
            "노란 꽃이 먼저 피어요",
            "가지가 길게 뻗어요",
            "봄을 알리는 나무예요",
          ],
          plantId: 1,
          plantName: "개나리",
        },
        {
          imgUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/%D7%A6%D7%91%D7%A2%D7%95%D7%A0%D7%99%D7%9D.JPG/300px-%D7%A6%D7%91%D7%A2%D7%95%D7%A0%D7%99%D7%9D.JPG",
          characteristics: [
            "컵 모양 꽃이 예뻐요",
            "색깔이 다양해요",
            "알뿌리로 자라요",
          ],
          plantId: 2,
          plantName: "튤립",
        },
        {
          imgUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Narzisse.jpg/300px-Narzisse.jpg",
          characteristics: [
            "노란 나팔 모양 꽃이 피어요",
            "봄을 알리는 꽃이에요",
            "알뿌리로 자라요",
          ],
          plantId: 3,
          plantName: "수선화",
        },
        {
          imgUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Taraxacum_platycarpum.JPG/300px-Taraxacum_platycarpum.JPG",
          characteristics: [
            "노란 꽃이 동그래요",
            "씨앗이 날아다녀요",
            "어디서나 잘 자라요",
          ],
          plantId: 4,
          plantName: "민들레",
        },
        {
          imgUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Viola_mandshurica_roadside.JPG/300px-Viola_mandshurica_roadside.JPG",
          characteristics: [
            "보라색 작은 꽃이 피어요",
            "하트 모양 잎이 있어요",
            "향기가 좋아요",
          ],
          plantId: 5,
          plantName: "제비꽃",
        },
        {
          imgUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/University_of_Georgia%2C_Research_and_Education_Garden_grass_3.JPG/300px-University_of_Georgia%2C_Research_and_Education_Garden_grass_3.JPG",
          characteristics: [
            "푸른 잎이 빽빽해요",
            "깎을수록 잘 자라요",
            "땅을 덮어요",
          ],
          plantId: 6,
          plantName: "잔디",
        },
        {
          imgUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Betula_platyphylla_01-10-2005_14.55.52.JPG/300px-Betula_platyphylla_01-10-2005_14.55.52.JPG",
          characteristics: [
            "하얀 나무껍질이 있어요",
            "가늘고 긴 가지가 있어요",
            "봄에 새싹이 돋아요",
          ],
          plantId: 7,
          plantName: "자작나무",
        },
        {
          imgUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Viola_tricolor_LC0041.jpg/300px-Viola_tricolor_LC0041.jpg",
          characteristics: [
            "얼굴 모양 꽃이 귀여워요",
            "색깔 조합이 다양해요",
            "추위에 강해요",
          ],
          plantId: 8,
          plantName: "팬지",
        },
        {
          imgUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Pteridium_aquilinum_nf.jpg/300px-Pteridium_aquilinum_nf.jpg",
          characteristics: [
            "잎이 예쁘게 말려 있어요",
            "그늘에서 잘 자라요",
            "봄에 새 잎이 나와요",
          ],
          plantId: 9,
          plantName: "고사리",
        },
      ],
      season: "SPRING",
    },
    completedQuests: [
      {
        completedAt: "2024-07-31T21:49:56.683776",
        latitude: 51.33724029657714,
        plantId: 4,
        id: 6,
        puzzleNumber: 2,
        content: "민들레이지용",
        longitude: -0.26168738698068683,
        imageData: null,
      },
      {
        completedAt: "2024-07-31T22:05:55.193334",
        latitude: 51.34160430812997,
        plantId: 6,
        id: 8,
        puzzleNumber: 2,
        content: "잔디잔디",
        longitude: -0.2577495574951172,
        imageData: null,
      },
    ],
  },
});
