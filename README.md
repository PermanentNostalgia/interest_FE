# 💰 금리도 모르면서

> 배우고, 써먹고. 금융 용어를 배우고 모의투자로 연습하는 모바일 웹 서비스

### 🔗 [https://interest-fe-three.vercel.app](https://interest-fe-three.vercel.app/)

설치 없이 위 주소로 접속한 뒤 **로그인 없이 둘러보기**를 누르면 바로 UNIT 1부터 시작할 수 있어요.

**금리도 모르면서**는 금융과 투자가 처음인 사람을 위한 학습 서비스입니다.
용어를 짧게 배우고, 직접 조작해 보고, OX 퀴즈로 확인한 다음, 모의투자에서 배운 지표를 실제 판단에 써 봅니다.
이 저장소는 프론트엔드 코드를 담고 있습니다.

## ✨ 주요 기능

### 📚 배우기

- 용어마다 **용어 정리 → 상황 가정 → 재설명 → 체험 → OX 퀴즈** 순서로 학습해요.
- 회전하는 유닛 카드에서 배울 유닛을 고를 수 있어요.
- 앞 유닛의 용어 퀴즈를 모두 맞히면 다음 유닛이 열려요.

| 유닛 | 용어 | 상태 |
| :---: | --- | --- |
| UNIT 1 | 금리, 시가총액, PER, PBR, ROE | 바로 학습 가능 |
| UNIT 2 | EPS, 영업이익, 채권, 부채비율, 매출액 | UNIT 1 완료 후 열림 |

### 📈 해보기 (모의투자)

- **시나리오 모드**: 정해진 상황과 뉴스를 보며 매수·매도를 연습해요. 하루씩 자동으로 흘러가고 속도를 1~3배로 바꿀 수 있어요. 현재는 시나리오 1만 열려 있어요.
- **자유 투자 모드**: 시작 자금, 기간, 종목을 직접 정해서 투자해요. 서버에서 시세를 불러오지 못하면 임의 데이터로 진행해요.
- 거래 중에 기업정보와 재무제표를 확인할 수 있고, 끝나면 잘한 점과 놓친 지표를 알려줘요.

### 🗂️ 내 기록

- 유닛, 시나리오, 자유투자 기록을 모아 봐요.
- 기록은 브라우저(`localStorage`)에 저장해요. 로그인한 상태의 자유 투자 결과는 서버에도 저장해요.

### 🔑 로그인

- 카카오 계정으로 로그인하거나, 로그인 없이 둘러볼 수 있어요.

## 🛠️ 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| UI | React 19 |
| 라우팅 | React Router 8 |
| 빌드 | Vite 8 |
| 린트 | Oxlint |
| 배포 설정 | Vercel |

## 📋 요구 사항

- **Node.js 22.22.0 이상** (React Router 8 요구 버전)
- npm
- (선택) 백엔드 API 서버: 카카오 로그인, 종목 시세 조회, 투자 결과 서버 저장에 필요해요. 없어도 둘러보기, 학습, 모의투자는 사용할 수 있어요.

## 🚀 시작하기

서비스를 사용만 한다면 <https://interest-fe-three.vercel.app/> 에 접속하면 돼요. 아래는 로컬에서 개발할 때의 실행 방법이에요.

저장소를 내려받아요.

```bash
git clone https://github.com/pknu-wap/interest_FE.git
cd interest_FE
```

의존성을 설치해요.

```bash
npm install
```

개발 서버를 실행해요.

```bash
npm run dev
```

브라우저에서 <http://localhost:5173> 에 접속한 뒤 **로그인 없이 둘러보기**를 누르면 바로 UNIT 1부터 시작할 수 있어요.

> 백엔드의 CORS 허용 주소에 맞춰 포트를 `5173`으로 고정했어요. 이미 사용 중인 포트라면 개발 서버가 실행되지 않아요.

### 환경 변수

로컬 개발 기본값은 `.env.development`에 있어요. 내 환경에서만 바꾸려면 `.env.development.local` 파일을 만들어 덮어쓰세요.

| 이름 | 용도 | 로컬 기본값 |
| --- | --- | --- |
| `VITE_API_BASE_URL` | 백엔드 API 주소. 배포 환경에서는 비워 두고 `vercel.json`의 rewrites를 사용해요. | `http://localhost:45240` |
| `VITE_KAKAO_LOGIN_ENDPOINT` | (선택) 로그인 API가 다른 서버에 있을 때 지정해요. 이 주소의 origin으로 `/api` 요청을 프록시해요. | 없음 |

카카오 로그인의 Redirect URI는 접속한 주소를 그대로 사용해요. 카카오 개발자 콘솔에 배포 주소 `https://interest-fe-three.vercel.app/`와 로컬 주소 `http://localhost:5173/`이 등록되어 있어야 해요.

### 스크립트

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | `dist/`에 배포용 빌드 생성 |
| `npm run preview` | 빌드 결과 미리 보기 |
| `npm run lint` | Oxlint 검사 |

## 🧭 화면 경로

| 경로 | 화면 |
| --- | --- |
| `/` | 스플래시, 로그인, 튜토리얼 |
| `/units/:unitName` | 유닛 선택 |
| `/units/:unitName/terms` | 유닛의 용어 목록과 진행률 |
| `/learn/:chapterName` | 용어 학습 |
| `/mock-invest` | 모의투자 |
| `/records` | 내 기록 |

## 📁 폴더 구조

```text
src/
├── api/           # 백엔드 API 요청
├── assets/        # 이미지, 폰트, 학습·시나리오 데이터
├── components/    # 화면별 컴포넌트
│   ├── common/        # 하단 탭
│   ├── learn_page/    # 용어 체험
│   ├── mock_invest/   # 모의투자
│   ├── pages/         # 스플래시, 로그인, 튜토리얼
│   └── unit_page/     # 유닛 카드
├── pages/         # 라우트 단위 페이지
├── styles/        # 공통 스타일
├── utils/         # 인증, 기록, 유닛 잠금, 거래 계산
├── App.jsx        # 첫 진입 화면 흐름
└── main.jsx       # 라우터 설정
```

학습 내용은 [learn_page_metadata.js](src/assets/learn_page/learn_page_metadata.js), 유닛 구성은 [unit_card_metadata.js](src/assets/unit_page/unit_card_metadata.js), 시나리오는 [scenario_metadata.js](src/assets/mock_invest/scenario_metadata.js)에서 수정해요.

## 👥 팀 소개

| <img src="https://github.com/PermanentNostalgia.png" width="100"> | <img src="https://github.com/pje3739.png" width="100"> | <img src="https://github.com/illustrious212.png" width="100"> | <img src="https://github.com/khw3268480.png" width="100"> | <img src="https://github.com/junseo05-26.png" width="100"> | 🎨 |
| :---: | :---: | :---: | :---: | :---: | :---: |
| [이현건](https://github.com/PermanentNostalgia) | [박지은](https://github.com/pje3739) | [김유찬](https://github.com/illustrious212) | [이형우](https://github.com/khw3268480) | [이준서](https://github.com/junseo05-26) | 윤세현 |
| Frontend | Frontend | Frontend | Backend | Backend | Design |
| 유닛 카드 UI, 라우팅 | 로그인, 튜토리얼 | 용어 학습, 모의투자, 내 기록 | 카카오 로그인, JWT, 학습 API | 시세 데이터, 차트 API | UI/UX 디자인 |

## 📄 라이선스

프로젝트 라이선스는 아직 정하지 않았어요.

앱에서 사용하는 RiaSans 폰트는 [별도의 라이선스](src/assets/fonts/RiaSans_license.pdf)를 따라요.
