# 📰 Keyword News

키워드를 등록하면 관련 뉴스를 한 곳에서 모니터링하는 웹앱 (PWA 지원)

---

## 📁 파일 구조

```
keyword-news/
├── public/               ← 웹앱 파일 (이 폴더를 웹서버에 올리세요)
│   ├── index.html        ← 메인 HTML
│   ├── style.css         ← 스타일
│   ├── app.js            ← 앱 로직
│   ├── manifest.json     ← PWA 설정
│   ├── sw.js             ← 서비스워커 (오프라인 지원)
│   └── icons/            ← 앱 아이콘 (직접 추가 필요, 아래 참고)
├── server/
│   └── proxy.js          ← 공식 RSS 수집 프록시 서버
├── package.json
└── README.md
```

---

## 🚀 빠른 시작 (API 없이 샘플 데이터로 실행)

1. `public/` 폴더를 아무 웹서버에 올리면 바로 실행됩니다.

**로컬 테스트:**
```bash
npx serve public -p 8080
# 브라우저에서 http://localhost:8080 열기
```

또는 VS Code의 **Live Server** 확장으로 `public/index.html`을 열어도 됩니다.

---

## 🔌 RSS 뉴스 연동 방법

### 방법 1: RSS 프록시 서버 사용 (권장, API 키 없음)

브라우저에서 여러 언론사 RSS를 직접 읽으면 CORS 문제가 생길 수 있습니다.
Node.js 프록시 서버가 공개 RSS를 모아 키워드로 필터링하고 앱 형식으로 변환합니다.

**1단계: 서버 실행**
```bash
# 서버 실행
node server/proxy.js
# → http://localhost:3001 에서 실행됨
```

별도 npm 패키지는 필요하지 않습니다. Node.js 18 이상이면 실행됩니다.
서버가 앱 파일도 함께 제공하므로 브라우저에서 `http://localhost:3001`을 열면 됩니다.

**2단계: 앱 열기**
- 같은 컴퓨터에서는 `http://localhost:3001`을 엽니다.
- 다른 컴퓨터에서는 서버가 켜진 컴퓨터의 IP로 `http://서버IP:3001`을 엽니다.
- 서버 실행 시 터미널에 `LAN App: http://...:3001` 주소가 표시됩니다. 다른 컴퓨터에서는 그 주소를 사용하세요.
- 다른 컴퓨터에서 `localhost:3001`을 열면 그 컴퓨터 자신을 찾기 때문에 RSS가 연결되지 않습니다.

앱은 같은 서버의 `/api/news`를 상대경로로 호출하므로, 다른 컴퓨터에서 열어도 각자 자기 `localhost`를 찾지 않습니다.

기본 RSS 소스는 `server/proxy.js`의 `RSS_SOURCES` 배열에서 관리합니다.
필요한 언론사의 공식 RSS URL을 추가하면 검색 범위가 넓어집니다.

### 방법 2: 네이버 뉴스 API 사용 (최후의 수단)

검색 품질이 더 필요하면 네이버 뉴스 검색 API를 별도로 붙일 수 있습니다.
단, 네이버 개발자 계정과 API 키가 필요하므로 개인/실험용 앱에서는 기본 방식으로 권장하지 않습니다.
사용한다면 키는 브라우저 코드에 넣지 말고 서버 환경변수에 보관하세요.

### 방법 3: 다른 뉴스 API 사용

`public/app.js`의 `fetchFromProxy()` 함수에서 응답 형식만 맞춰주면 됩니다.
지원 가능한 API:
- **Bing News Search API** (Azure) — https://www.microsoft.com/en-us/bing/apis/bing-news-search-api
- **The News API** — https://www.thenewsapi.com
- **NewsCatcher API** — https://newscatcherapi.com

---

## 📱 PWA로 스마트폰에 설치하기

1. 크롬/사파리로 앱 열기
2. 주소창 옆 **설치** 버튼 클릭 (Android)
   또는 **공유 → 홈 화면에 추가** (iPhone)
3. 앱처럼 홈화면에서 실행 가능

> ⚠️ PWA는 **HTTPS** 환경에서만 설치 가능합니다.
> 로컬 테스트는 `localhost`에서도 됩니다.

---

## 🖼️ 앱 아이콘 추가 방법

`public/icons/` 폴더를 만들고 아래 파일을 추가하세요:
- `icon-192.png` (192×192px)
- `icon-512.png` (512×512px)

무료 아이콘 생성: https://favicon.io 또는 https://realfavicongenerator.net

---

## 🌐 배포 방법

### Vercel (무료, 권장)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
- https://app.netlify.com 에서 `public/` 폴더 드래그앤드롭

### GitHub Pages
- GitHub 저장소 생성 → `public/` 폴더 내용 업로드
- Settings → Pages → Source: main branch

> 배포 후 프록시 서버도 같은 서버에 올리거나,
> Railway / Render / Fly.io 등 무료 Node.js 호스팅 서비스 사용

---

## ✨ 주요 기능

| 기능 | 설명 |
|------|------|
| 키워드 관리 | 추가, 삭제, 미읽음 카운트 |
| 뉴스 목록 | 클릭 시 요약+이미지 확장 |
| 읽음 처리 | **접을 때** 흐리게 표시 (열람 확인 후) |
| 원문 보기 | 원문 버튼 클릭 시 새 탭으로 이동 |
| 관련 기사 | 지정된 관련 기사 링크로 직접 이동 |
| 스크랩 | 기사 저장, 설정에서 목록 확인 |
| 공유 | 링크 복사 |
| 다크모드 | 라이트/다크 테마 전환 |
| 계정 | 회원가입/로그인 (로컬 저장소 기반) |
| PWA | 오프라인 지원, 홈화면 설치 |

---

## 🗺️ 향후 개발 계획

- [ ] 카카오톡 SDK 연동 (실제 카카오톡 공유)
- [ ] 푸시 알림 (새 뉴스 알림)
- [ ] 백엔드 DB 연동 (Firebase / Supabase)
- [ ] React Native로 iOS/Android 앱 변환
- [ ] RSS 소스 편집 UI
- [ ] 뉴스 썸네일 자동 추출 (Open Graph)

---

## 💬 문의

앱 관련 문의나 기능 요청은 이슈로 남겨주세요.
