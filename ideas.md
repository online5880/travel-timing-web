# Travel Timing Finder - 디자인 아이디어

<response>
<text>
## 아이디어 1: Neo-Cartographic Brutalism

**Design Movement**: 디지털 브루탈리즘과 현대 지도학의 융합

**Core Principles**:
- 기능이 형태를 결정하는 원칙 - 지도와 데이터가 시각적 위계의 중심
- 원시적이고 직접적인 정보 전달 - 불필요한 장식 제거
- 대담한 타이포그래피와 명확한 구조적 그리드
- 데이터 시각화를 예술적 요소로 승격

**Color Philosophy**: 
지도학적 색상 체계를 현대적으로 재해석. 깊은 차콜 배경(#1a1a1a)에 네온 강조색(시안 #00ffff, 라임 #ccff00, 마젠타 #ff00ff)을 사용하여 정보의 계층을 구분. 각 색상은 감정이 아닌 기능을 나타냄 - 시안은 물/날씨, 라임은 최적 시기, 마젠타는 경고/주의.

**Layout Paradigm**: 
비대칭 분할 레이아웃 - 왼쪽 60%는 전체 화면 인터랙티브 지도, 오른쪽 40%는 고정된 데이터 패널이 수직으로 스크롤. 모바일에서는 지도가 상단 50vh를 차지하고 데이터가 하단 시트로 슬라이드업.

**Signature Elements**:
- 두꺼운 1px 실선 구분자와 직각 모서리 (border-radius: 0)
- 모노스페이스 폰트로 표시되는 모든 숫자 데이터
- 지도 위에 떠있는 반투명 검은색 오버레이 카드 (backdrop-filter: blur)

**Interaction Philosophy**: 
즉각적이고 직접적인 피드백. 클릭은 즉시 데이터를 로드하며 로딩 상태는 진행률 바가 아닌 스켈레톤 텍스트로 표시. 호버 효과는 미묘한 배경색 변화만 사용.

**Animation**: 
최소한의 애니메이션 - 모든 전환은 100ms 이하의 linear easing. 데이터 변경 시 숫자는 카운트업 애니메이션 없이 즉시 교체. 지도 이동만 300ms ease-out 사용.

**Typography System**: 
- Display: Space Grotesk Bold (제목, 도시명) - 기하학적이고 대담한 sans-serif
- Body: IBM Plex Mono Regular (모든 데이터, 숫자) - 명확한 가독성의 모노스페이스
- UI: Inter Medium (버튼, 레이블) - 중립적인 인터페이스 폰트
- 크기 비율: 48px / 16px / 14px (3:1:0.875)
</text>
<probability>0.08</probability>
</response>

<response>
<text>
## 아이디어 2: Organic Wanderlust Aesthetics

**Design Movement**: 유기적 모더니즘과 자연주의 디자인의 결합

**Core Principles**:
- 자연의 흐름과 리듬을 디지털 인터페이스로 번역
- 부드러운 곡선과 비정형 형태로 따뜻함 전달
- 계절의 변화를 색상과 텍스처로 표현
- 정보를 이야기처럼 풀어내는 내러티브 구조

**Color Philosophy**: 
계절별 팔레트 시스템 - 봄(연한 복숭아 #ffd4a3, 민트 #b8e6d5), 여름(코랄 #ff6b6b, 스카이블루 #4ecdc4), 가을(번트오렌지 #e76f51, 올리브 #8d6e63), 겨울(아이스블루 #a8dadc, 슬레이트 #457b9d). 선택된 지역의 현재 계절에 따라 전체 UI 색상이 동적으로 변화.

**Layout Paradigm**: 
유동적 카드 기반 레이아웃 - 지도는 화면 상단에 둥근 모서리의 큰 카드로 배치되고, 그 아래로 정보 카드들이 Pinterest 스타일의 masonry 그리드로 흐름. 각 카드는 다른 높이와 너비를 가져 유기적인 리듬 생성.

**Signature Elements**:
- 24px 이상의 큰 border-radius로 모든 요소를 부드럽게 처리
- 수채화 스타일의 그라디언트 배경 (linear-gradient with 3+ stops)
- 손으로 그린 듯한 SVG 아이콘과 일러스트레이션

**Interaction Philosophy**: 
부드럽고 예측 가능한 상호작용. 모든 클릭 가능한 요소는 호버 시 살짝 떠오르는 듯한 효과 (transform: translateY(-4px) + shadow). 지도 마커는 클릭 시 펄스 애니메이션으로 선택 상태 표시.

**Animation**: 
자연스러운 ease-in-out 곡선 사용 - 모든 전환은 400-600ms. 카드 등장 시 stagger 애니메이션으로 순차적으로 페이드인. 날씨 아이콘은 미묘한 floating 애니메이션 (3초 주기).

**Typography System**: 
- Display: Playfair Display (제목) - 우아하고 클래식한 serif
- Body: Lora Regular (설명 텍스트) - 가독성 높은 serif
- UI: Nunito Sans (버튼, 레이블, 숫자) - 친근한 rounded sans-serif
- 크기 비율: 42px / 18px / 15px (2.8:1.2:1)
</text>
<probability>0.07</probability>
</response>

<response>
<text>
## 아이디어 3: Data-Driven Expedition Interface

**Design Movement**: 스위스 디자인과 데이터 시각화의 정밀한 결합

**Core Principles**:
- 정보의 명확성과 계층 구조를 최우선으로
- 그리드 시스템에 기반한 수학적 정확성
- 색상은 의미를 전달하는 도구로만 사용
- 모든 요소는 목적과 기능을 가짐

**Color Philosophy**: 
온도 기반 스펙트럼 색상 시스템 - 차가운 파랑(#0066cc)에서 따뜻한 주황(#ff6600)까지의 그라디언트를 온도 데이터에 매핑. 중립적인 회색 배경(#f5f5f5)에 검은색 텍스트(#1a1a1a)로 최대 가독성 확보. 강조색은 단 하나 - 전기 블루(#0080ff)로 선택/활성 상태 표시.

**Layout Paradigm**: 
12열 그리드 기반 대시보드 레이아웃 - 상단 1/3은 전폭 지도, 하단 2/3는 4개의 동일한 크기 데이터 카드가 2x2 그리드로 배치 (날씨, 환율, 계절, 항공권). 각 카드는 내부적으로 차트와 텍스트를 정렬된 그리드로 구성.

**Signature Elements**:
- 1px 회색 선(#e0e0e0)으로 구분된 명확한 섹션 구분
- 모든 차트는 선 그래프 또는 막대 그래프로 통일
- 데이터 포인트에 호버 시 정확한 값을 표시하는 툴팁

**Interaction Philosophy**: 
정밀하고 예측 가능한 인터랙션. 모든 클릭 가능한 영역은 명확한 시각적 피드백 제공. 지도 클릭 시 선택된 위치에 핀이 고정되고 데이터 카드가 동시에 업데이트. 탭 전환은 언더라인 애니메이션으로 표시.

**Animation**: 
기능적 애니메이션만 사용 - 데이터 로딩 시 스켈레톤 스크린, 차트 데이터는 200ms linear로 그려짐. 페이지 전환 없음, 모든 것은 단일 페이지에서 상태 변경으로 처리.

**Typography System**: 
- Display: Helvetica Neue Bold (제목, 도시명) - 클래식한 스위스 타이포그래피
- Body: Helvetica Neue Regular (설명) - 중립적이고 명확한 가독성
- Data: SF Mono Medium (모든 숫자, 차트 레이블) - 정렬이 완벽한 모노스페이스
- 크기 비율: 36px / 16px / 14px (2.57:1.14:1)
</text>
<probability>0.09</probability>
</response>
