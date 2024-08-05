export const mockSeasonPlantList = {
  season: "Summer",
  plants: [
    {
      plantId: 1,
      plantName: "Rose",
      imgUrl:
        "https://latestforyouth.com/wp-content/uploads/2021/04/rose-plant-8.jpg",
      characteristics: [
        "Beautiful fragrance",
        "Thorny stems",
        "Variety of colors",
      ],
    },
    {
      plantId: 2,
      plantName: "Daylily",
      imgUrl:
        "https://assets.highcountrygardens.com/media/catalog/product/h/e/hemerocallis-stella-d-oro-yellow-cropped.jpg?quality=85&fit=bounds&height=&width=3840&auto=webp&format=pjpg",
      characteristics: [
        "Hardy perennial",
        "Long blooming season",
        "Low maintenance",
      ],
    },
    {
      plantId: 3,
      plantName: "SweetPea",
      imgUrl:
        "https://dropinblog.net/34237421/files/growing_guides/GROWING-SWEETPEAS.jpg",
      characteristics: [
        "Fragrant plants",
        "Climbing vine",
        "Cool weather preference",
      ],
    },
    {
      plantId: 4,
      plantName: "Dahlia",
      imgUrl:
        "https://upload.wikimedia.org/wikipedia/commons/a/ab/Dahlia_x_hybrida.jpg",
      characteristics: [
        "Large blooms",
        "Variety of vibrant colors",
        "Excellent cut plants",
      ],
    },
    {
      plantId: 5,
      plantName: "Geranium",
      imgUrl:
        "https://dutch-bulbs.com/media/catalog/product/cache/b29e7430105b9055abcf4669b36d1b29/h/a/hardy-geranium-collection.jpg",
      characteristics: [
        "Drought tolerant",
        "Attracts pollinators",
        "Long blooming period",
      ],
    },
    {
      plantId: 6,
      plantName: "Lavender",
      imgUrl: "https://ipm.missouri.edu/mpg/thumbnails/lavendar.jpg",
      characteristics: [
        "Fragrant foliage",
        "Medicinal properties",
        "Drought resistant",
      ],
    },
    {
      plantId: 7,
      plantName: "Foxglove",
      imgUrl:
        "https://dropinblog.net/34237421/files/growing_guides/GROWING-SWEETPEAS.jpg",
      characteristics: [
        "Tall spikes of plants",
        "Biennial plant",
        "Shade tolerant",
      ],
    },
    {
      plantId: 8,
      plantName: "Marigolds",
      imgUrl:
        "https://dropinblog.net/34237421/files/growing_guides/GROWING-SWEETPEAS.jpg",
      characteristics: [
        "Bright, cheerful blooms",
        "Pest repellent",
        "Easy to grow",
      ],
    },
    {
      plantId: 9,
      plantName: "Peonies",
      imgUrl:
        "https://dropinblog.net/34237421/files/growing_guides/GROWING-SWEETPEAS.jpg",
      characteristics: [
        "Large, fragrant plants",
        "Long-lived perennial",
        "Deer resistant",
      ],
    },
  ],
};

// 구글맵 다중 마커 위치 설정  //사용자위치는별도로?
export const mockMarkerPositions = [
  // { lat: 51.33497629314483, lng: -0.2676980993784051 }, // Example marker 1
  // { lat: 51.341601163436756, lng: -0.2596770172482633 }, // Example marker 2
];

//mapComponent에서 주변의 마커, 데이터들 받아오기 (quest)
export const mockDataforMapComponent = {
  nearbyQuests: [
    {
      id: 6,
      content: "민들레",
      latitude: 51.33724029657714,
      longitude: -0.26168738698068683,
      completedAt: "2024-07-31T21:49:56.683776",
      imageUrl: "https://269e-218-233-42-240.ngrok-free.app/api/quests/image/6",
      userId: 3,
      userName: "YB M",
      plantId: 4,
      plantName: "Dandelion",
    },
    {
      id: 7,
      content: "미슬",
      latitude: 51.34528280973821,
      longitude: -0.26512061451974933,
      completedAt: "2024-07-31T21:51:33.292603",
      imageUrl: "https://269e-218-233-42-240.ngrok-free.app/api/quests/image/7",
      userId: 3,
      userName: "YB M",
      plantId: 33,
      plantName: "Mistletoe",
    },
    {
      id: 9,
      content: "잔디... 발견하기 제일 쉬울듯요 ㅋㅋ",
      latitude: 51.341601163436756,
      longitude: -0.2596770172482633,
      completedAt: "2024-08-02T01:55:09.595835",
      imageUrl: "https://269e-218-233-42-240.ngrok-free.app/api/quests/image/9",
      userId: 3,
      userName: "YB M",
      plantId: 6,
      plantName: "Grass",
    },
    {
      id: 10,
      content: "장미!!!!!",
      latitude: 51.341601163436756,
      longitude: -0.2596770172482633,
      completedAt: "2024-08-02T01:59:58.771617",
      imageUrl:
        "https://269e-218-233-42-240.ngrok-free.app/api/quests/image/10",
      userId: 3,
      userName: "YB M",
      plantId: 10,
      plantName: "Rose",
    },
    {
      id: 11,
      content: "수국수국",
      latitude: 51.341601163436756,
      longitude: -0.2596770172482633,
      completedAt: "2024-08-02T02:01:23.05132",
      imageUrl:
        "https://269e-218-233-42-240.ngrok-free.app/api/quests/image/11",
      userId: 3,
      userName: "YB M",
      plantId: 15,
      plantName: "Hydrangea",
    },
    {
      id: 12,
      content: "클로버!!!!!",
      latitude: 51.341601163436756,
      longitude: -0.2596770172482633,
      completedAt: "2024-08-02T02:02:07.54837",
      imageUrl:
        "https://269e-218-233-42-240.ngrok-free.app/api/quests/image/12",
      userId: 3,
      userName: "YB M",
      plantId: 14,
      plantName: "Clover",
    },
    {
      id: 13,
      content: "참취..?",
      latitude: 51.341601163436756,
      longitude: -0.2596770172482633,
      completedAt: "2024-08-02T02:02:59.049166",
      imageUrl:
        "https://269e-218-233-42-240.ngrok-free.app/api/quests/image/13",
      userId: 3,
      userName: "YB M",
      plantId: 24,
      plantName: "Aster",
    },
  ],
};

//mapComponent에서 주변의 마커, 데이터들 받아오기 (plant note)
export const mockDataPlantNote = {
  nearbyPlantNotes: [
    {
      id: 1,
      title: "고등어",
      content: "인가요 고등어먹고싶네요",
      latitude: 51.32317260670891,
      longitude: -0.26545126767578475,
      createdAt: "2024-08-06T01:18:29.425098",
      imageUrl:
        "https://269e-218-233-42-240.ngrok-free.app/api/plant-notes/image/1",
      userId: 3,
      userName: "YB M",
      infoType: "SELECTED",
      plantId: 9,
      plantInfo: null,
    },
    {
      id: 2,
      title: "허니감자칩인가요?",
      content: "냄새가 넘 좋네요 킁킁",
      latitude: 51.325049895208444,
      longitude: -0.2714594158691441,
      createdAt: "2024-08-06T01:19:14.508561",
      imageUrl:
        "https://269e-218-233-42-240.ngrok-free.app/api/plant-notes/image/2",
      userId: 3,
      userName: "YB M",
      infoType: "CUSTOM",
      plantId: null,
      plantInfo: "허니감자칩",
    },
    {
      id: 3,
      title: "우웹....",
      content: "누가 이런걸 키우나요...",
      latitude: 51.3225289472482,
      longitude: -0.27506430478515975,
      createdAt: "2024-08-06T01:19:43.253186",
      imageUrl:
        "https://269e-218-233-42-240.ngrok-free.app/api/plant-notes/image/3",
      userId: 3,
      userName: "YB M",
      infoType: "UNKNOWN",
      plantId: null,
      plantInfo: null,
    },
  ],
};
