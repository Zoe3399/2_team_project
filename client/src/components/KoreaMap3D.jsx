import React, { useRef, useState } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import koreaMapImg from '@/assets/korea-map.png';
import './KoreaMap3D.css';

// 1년 평균 생산지수 기반 (예시 값, 실제 수치)
const productivityData = {
  서울: 111.8,
  부산: 108.2,
  대구: 104.3,
  인천: 106.5,
  광주: 102.7,
};

// 도시별 3D 위치 좌표 (전체 지도가 잘 보이도록 조정)
const cityPositions = {
  서울: [0.0, 0.45, 0.01],
  부산: [0.3, -0.22, 0.01],
  대구: [0.15, -0.03, 0.01],
  인천: [-0.25, 0.28, 0.01],
  광주: [-0.08, -0.23,0.1]
};

// 도시 순서 배열 (순위별)
const cityOrder = ['서울', '부산', '대구', '인천', '광주'];

function KoreaMapTexture({ selectedCity, setSelectedCity, setHoveredCity, hoveredCity, showOverlay }) {
  const texture = useLoader(THREE.TextureLoader, koreaMapImg);
  // 지도 평면의 크기(비율) 조정
  const width = 1.2;
  const height = 1.5;

  return (
    <group>
      {/* 지도 텍스처 평면 */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} transparent />
      </mesh>
      {/* 도시별 포인트와 라벨 */}
      {Object.entries(cityPositions).map(([city, position]) => (
        <group key={city} position={position}>
          <mesh
            onPointerOver={() => setHoveredCity(city)}
            onPointerOut={() => setHoveredCity(null)}
            onClick={() => {
              setSelectedCity(city);
              setHoveredCity(null);
            }}
          >
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshPhongMaterial
              color={
                selectedCity === city
                  ? 0xffd700
                  : hoveredCity === city
                  ? 0xffa500
                  : 0xff6b6b
              }
              transparent
              opacity={0.7}
            />
          </mesh>
          {showOverlay && selectedCity === city && (
            <Html center>
              <div className="map-center-label">
                <div className="score">{productivityData[city]}</div>
                <div className="city-name">{city}</div>
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
}

// 메인 컴포넌트
const KoreaMap3D = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [hoveredCity, setHoveredCity] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const handleCitySelect = (cityIndex) => {
    const city = cityOrder[cityIndex - 1];
    const isSame = selectedCity === city;
    setSelectedCity(isSame ? null : city);
    setShowOverlay(!isSame ? true : false);
  };

  return (
    <div className="korea-map-3d">
      <Canvas camera={{ position: [0, 0, 1.8], fov: 40 }}>
        <color attach="background" args={[0xf0f8ff]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 2, 2]} intensity={0.7} />
        <KoreaMapTexture
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          setHoveredCity={setHoveredCity}
          hoveredCity={hoveredCity}
          showOverlay={showOverlay}
        />
      </Canvas>
      <div className="city-buttons">
        {[1, 2, 3, 4, 5].map((num) => {
          const city = cityOrder[num - 1];
          // 선택된 도시가 없으면 모두 비선택 상태
          const isSelected = selectedCity === city && selectedCity !== null;
          return (
            <button
              key={num}
              className={`city-button${isSelected ? ' selected' : ''}`}
              data-city={city}
              onClick={() => handleCitySelect(num)}
            >
              {num}
            </button>
          );
        })}
      </div>
      // TODO: 여기에 지역 간 비교 차트 추가 가능 (ex. 바 차트, 꺾은선 그래프 등)
      <div className="map-overlay">
        <h3>지역별 생산성 순위</h3>
        <div className="region-list">
          {Object.entries(productivityData)
            .sort(([, a], [, b]) => b - a)
            .map(([city, score], index) => (
              <div key={city} className={`region-item ${selectedCity === city ? 'selected' : ''}`}>
                <span className="region-rank">{index + 1}</span>
                <span className="region-name">{city}</span>
                <span className="region-score">{score}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default KoreaMap3D; 