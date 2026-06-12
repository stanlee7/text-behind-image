# 누끼 텍스트 (Text Behind Image)

포토샵 없이 인물 뒤로 텍스트를 넣는 무료 웹 에디터.
이미지를 올리면 AI가 자동으로 인물을 분리하고, 텍스트를 인물 뒤 레이어에 배치해 깊이감 있는 썸네일을 만들어 줍니다.

**Live**: https://text-behind-image-nine.vercel.app

## 주요 기능

- **AI 배경 제거** — `@imgly/background-removal`로 100% 브라우저에서 처리. 사진이 서버로 전송되지 않습니다.
- **다중 텍스트 레이어** — 레이어 추가/복제/삭제, 레이어별 인물 앞/뒤 배치
- **멀티라인 텍스트** — 줄바꿈 지원, 캔버스 드래그로 위치 이동 (마우스/터치)
- **풍부한 스타일** — 크기·굵기·색상·투명도·회전·자간·외곽선·그림자
- **한글 디스플레이 폰트** — 블랙한산스, 도현, 주아, 나눔 손글씨 등 썸네일용 폰트 내장
- **진행률 표시** — 최초 AI 모델 다운로드 진행 상황 안내
- **PNG 다운로드** — 원본 해상도 그대로 내보내기

## 기술 스택

- Next.js (App Router) + React + TypeScript
- Tailwind CSS
- Canvas 2D API (레이어 합성 렌더링)
- `@imgly/background-removal` (클라이언트 사이드 ONNX 추론)

## 개발

```bash
npm install
npm run dev   # http://localhost:3000
npm run build # 프로덕션 빌드
```

## 동작 원리

1. 업로드한 원본 이미지를 배경 레이어로 사용
2. AI가 인물(전경)만 분리한 투명 PNG 생성
3. 캔버스에 `배경 → 뒤 텍스트 → 인물 → 앞 텍스트` 순서로 합성
