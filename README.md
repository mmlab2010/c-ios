# 계산기 & 환율 계산기 아이폰 전체화면 PWA 앱 (CalcExchange iPhone PWA)

`https://mmlab2010.github.io/calc/` 사이트(복합 계산기 & 실시간 환율 계산기)를 **아이폰(iOS)에서 주소창과 하단 툴바가 없는 전체화면(Standalone Fullscreen) PWA 방식**으로 동작하도록 제작한 프로젝트입니다.  
로컬 PC에 별도의 앱 빌드 도구(Xcode, 안드로이드 스튜디오 등)가 없어도 **GitHub Actions**를 통해 자동으로 PWA 패키지를 검증·빌드하고, **GitHub Pages 배포** 및 **iOS 전체화면 설치 프로파일(`.mobileconfig`)** 아티팩트를 생성합니다.

---

## 주요 특징

1. **아이폰 완전한 전체화면(Standalone Fullscreen) PWA 동작**
   - `manifest.json`(`display: "standalone"`) 및 iOS 전용 메타 태그(`apple-mobile-web-app-capable="yes"`, `apple-mobile-web-app-status-bar-style="black-translucent"`, `viewport-fit=cover`)가 적용되어 아이폰 홈 화면에서 실행 시 Safari 상/하단 주소창 없이 네이티브 앱처럼 화면 전체를 꽉 채워 작동합니다.
   - 아이폰 노치(Notch) / 다이내믹 아일랜드 및 하단 홈 인디케이터 영역을 침범하지 않도록 `env(safe-area-inset-*)` 여백과 `100dvh` 레이아웃을 적용했습니다.
   - **Service Worker (`sw.js`)** 를 탑재하여 앱 셸(HTML, CSS, JS, 아이콘)과 최근 환율 데이터를 캐싱하므로 오프라인 상태에서도 계산기와 환율 계산기가 즉시 실행됩니다.
   - 상단 헤더의 **`앱 설치` 버튼**을 누르면 아이폰 Safari에서 홈 화면에 추가하는 단계별 안내 모달과 `.mobileconfig` 원클릭 프로파일 다운로드 기능을 제공합니다(이미 전체화면 앱으로 실행 중일 때는 자동으로 숨겨집니다).

2. **맞춤형 고해상도 iOS 앱 아이콘 & 스플래시 화면**
   - 사칙연산 기호(`+`, `-`, `÷`, `=`)와 글로벌 통화 기호(`$`, `₩`, `€`, `¥`) 및 환전 순환 화살표가 조화를 이루는 밝고 세련된 iOS 18 글래스모피즘 디자인 아이콘을 제작하여 적용했습니다.
   - 원본 아이콘: 프로젝트 루트의 [`app_icon.png`](./app_icon.png) (`1024×1024`) 및 [`apple-touch-icon.png`](./apple-touch-icon.png) (`180×180`)
   - 해상도별 아이콘 세트([`icons/`](./icons)):
     - iOS 홈 화면 아이콘: `180×180`, `167×167`, `152×152`, `120×120`
     - PWA 매니페스트 아이콘: `192×192`, `512×512`, `1024×1024`
     - iOS 앱 시작 스플래시 이미지: `icons/apple-splash-1170x2532.png`

3. **개발 도구 없이 GitHub Actions 자동 빌드 & 배포**
   - [`.github/workflows/ios-pwa-build.yml`](./.github/workflows/ios-pwa-build.yml) 워크플로우가 포함되어 있어 GitHub 저장소에 푸시하기만 하면 자동으로 다음 작업을 수행합니다:
     1. **PWA 번들 아티팩트 생성 (`CalcExchange-iPhone-PWA-WebApp`)**
     2. **아이폰 전체화면 Web Clip 프로파일 생성 (`CalcExchange-iPhone-MobileConfig`)**
     3. **GitHub Pages 자동 배포 (`https://<계정명>.github.io/<저장소명>/`)**

---

## GitHub Actions 빌드 및 아이폰 설치 방법

### 1단계: GitHub 저장소 생성 및 코드 업로드
1. [GitHub](https://github.com/)에서 새 저장소(Repository)를 생성합니다 (또는 기존 `calc` 저장소를 사용합니다).
2. 현재 폴더에서 터미널(PowerShell)을 열고 아래 명령어를 실행하여 GitHub에 푸시합니다:
   ```powershell
   git init
   git add .
   git commit -m "Initial commit: Calculator & Currency iPhone Fullscreen PWA"
   git branch -M main
   git remote add origin https://github.com/<본인계정>/<저장소이름>.git
   git push -u origin main
   ```

### 2단계: GitHub Actions 빌드 확인 및 GitHub Pages 활성화
1. GitHub 저장소 상단 탭에서 **Actions** 메뉴로 이동하면 `iPhone PWA Build & Deploy` 워크플로우가 자동으로 실행되어 초록색 체크 표시로 완료됩니다.
2. 워크플로우 하단 **Artifacts** 섹션에서 빌드된 결과물을 바로 다운로드할 수 있습니다:
   - **`CalcExchange-iPhone-PWA-WebApp`**: 전체화면 PWA 웹 앱 전체 패키지
   - **`CalcExchange-iPhone-MobileConfig`**: `https://mmlab2010.github.io/calc/` 사이트를 아이폰 홈 화면에 전체화면 앱으로 바로 설치해주는 iOS 구성 프로파일(`CalcExchange-iPhone-App.mobileconfig`)
3. 저장소 상단 **Settings → Pages → Build and deployment → Source**를 **`GitHub Actions`**(또는 `Deploy from a branch -> main`)로 설정하면 `https://<본인계정>.github.io/<저장소이름>/` 주소로 즉시 배포됩니다.

### 3단계: 아이폰에서 전체화면 앱으로 설치하기 (2가지 방법)

#### 방법 A: 아이폰 Safari에서 '홈 화면에 추가' (표준 PWA 방식)
1. 아이폰 **Safari** 브라우저로 배포된 사이트 주소(예: `https://mmlab2010.github.io/calc/` 또는 본인의 GitHub Pages 주소)에 접속합니다.
2. 화면 하단 중앙의 **공유 버튼 `[↑]`** 을 누릅니다 (또는 앱 화면 우측 상단의 **`앱 설치`** 안내 버튼을 눌러 가이드를 확인합니다).
3. 메뉴를 아래로 스크롤하여 **`홈 화면에 추가`** 를 누른 뒤 우측 상단의 **`추가`** 를 탭합니다.
4. 아이폰 홈 화면에 생성된 **스마트 계산기** 아이콘을 실행하면 주소창이 없는 **전체화면 아이폰 앱**으로 동작합니다.

#### 방법 B: iOS Web Clip 프로파일(`.mobileconfig`)로 설치
1. 아이폰 Safari에서 사이트 내 **`앱 설치` → `iOS 전체화면 프로파일(.mobileconfig) 다운로드`** 를 누르거나 GitHub Actions 아티팩트의 `CalcExchange-iPhone-App.mobileconfig` 파일을 엽니다.
2. 아이폰 **`설정` → `프로파일이 다운로드됨` → `설치`** 를 누르면 `https://mmlab2010.github.io/calc/` 사이트가 맞춤 아이콘과 함께 **전체화면(FullScreen) 아이폰 앱**으로 홈 화면에 즉시 추가됩니다.