// React 및 slick-carousel 관련 모듈 불러오기
import Slider from "react-slick"; // 슬라이더 라이브러리
import "slick-carousel/slick/slick.css"; // slick 기본 스타일
import "slick-carousel/slick/slick-theme.css"; // slick 테마 스타일
import "./Banner.css"; // 커스텀 배너 CSS

interface BannerItem {
  id: number;
  img: string;
  alt: string;
}

// 실제 배너 이미지 리스트 (배너는 이미지로만 구성됨)
const banners: BannerItem[] = [
  { id: 1, img: "/images/banner1.jpg", alt: "배너 1" },
  { id: 2, img: "/images/banner2.jpg", alt: "배너 2" },
  { id: 3, img: "/images/banner3.jpg", alt: "배너 3" },
];

export default function Banner() {
  // 슬라이더 설정값 정의
  const settings: import("react-slick").Settings = {
    dots: true,            // 하단 네비게이션 점 표시
    infinite: true,        // 무한 반복
    speed: 600,            // 슬라이드 전환 속도 (ms)
    slidesToShow: 1,       // 한 번에 보여줄 슬라이드 수
    slidesToScroll: 1,     // 한 번에 넘길 슬라이드 수
    autoplay: true,        // 자동 슬라이드 재생
    autoplaySpeed: 4000,   // 자동 전환 간격 (ms)
  };

  return (
    <div className="banner-wrapper">
      {/* 슬라이더 영역 */}
      <Slider {...settings}>
        {banners.map((b) => (
          <div key={b.id} className="banner-slide">
            {/* 배너 이미지만 출력 */}
            <img src={b.img} alt={b.alt} className="banner-image" />
          </div>
        ))}
      </Slider>
    </div>
  );
}