export const TOUR_SAMPLE = {
  name: "Khám Phá Vịnh Hạ Long 2 Ngày 1 Đêm",
  duration: "2 ngày 1 đêm",
  maxGroupSize: 25,
  rating: 4.8,
  reviews: 35,
  price: 4150000,
  summary:
    "Hành trình tuyệt vời trên du thuyền cao cấp, khám phá Vịnh Hạ Long và trải nghiệm chèo kayak, bơi lội và thưởng thức ẩm thực.",
  description:
    "Tham gia chuyến du ngoạn 2 ngày 1 đêm trên du thuyền 5 sao tại Vịnh Hạ Long. Hành trình đưa bạn khám phá các hang động kỳ vĩ, chèo kayak giữa thiên nhiên hoang sơ và thưởng thức những bữa ăn hải sản tươi ngon. Đây sẽ là trải nghiệm không thể nào quên trong đời.",
  imageCover: "/thuyen1.png",
  images: ["/thuyen1.png", "/thuyen2.png", "/thuyen3.png"],
  locations: [
    {
      type: "Point",
      coordinates: [107.0501, 20.9101], // longitude, latitude
      address: "Bến tàu Tuần Châu, Hạ Long, Quảng Ninh",
      description: "Nơi bắt đầu chuyến hành trình du thuyền.",
      day: 1,
    },
    {
      type: "Point",
      coordinates: [107.0581, 20.9161],
      address: "Hang Sửng Sốt, Vịnh Hạ Long",
      description: "Khám phá hang động đẹp nhất Vịnh Hạ Long.",
      day: 1,
    },
    {
      type: "Point",
      coordinates: [107.0621, 20.9251],
      address: "Làng chài Cửa Vạn",
      description: "Tham quan làng chài nổi tiếng trên Vịnh.",
      day: 2,
    },
    {
      type: "Point",
      coordinates: [107.0501, 20.9101],
      address: "Bến tàu Tuần Châu, Hạ Long, Quảng Ninh",
      description: "Kết thúc hành trình, quay về bến tàu Tuần Châu.",
      day: 2,
    },
  ],
};
