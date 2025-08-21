# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 중요 지침
- 모든 답변은 한글로 작성

## Commands

### Development
- `npm run dev` - Start development server with Turbopack on http://localhost:3000
- `npm run build` - Build production application with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code linting
- `npm run export` - Build and export static files for GitHub Pages deployment

### Installation
- `npm install` - Install dependencies

## Architecture

This is a Next.js 15.5.0 application using the App Router architecture with TypeScript and Tailwind CSS v4.

### Project Structure
- `src/app/` - App Router pages and layouts
  - `layout.tsx` - Root layout with Geist font configuration  
  - `page.tsx` - Main page with question table and detailed questions
  - `globals.css` - Global styles with Tailwind directives
- `src/data/` - Extracted and processed question data
  - `exam-questions.txt` - Raw text extracted from PDF
  - `all-questions.json` - 33 structured questions with answers and explanations
  - `question-table.json` - KICE exam structure overview table
- `scripts/` - Data processing scripts
  - `extract-pdf.js` - PDF to text extraction
  - `extract-all-questions.js` - Parse questions from text
  - `extract-question-table.js` - Create exam structure table
- `raw-data/` - Original PDF documents
  - `기출문제-v4-*.pdf` - Past exam questions
  - `예상문제-v12-*.pdf` - Expected questions (main source)
  - `참고 자료-v2-*.pdf` - Reference materials
- `public/` - Static assets served at root path

### Key Technologies
- **Next.js 15.5.0** with App Router and Turbopack
- **React 19.1.0** and React DOM 19.1.0
- **TypeScript** with strict mode enabled
- **Tailwind CSS v4** with PostCSS configuration
- **ESLint** with Next.js configuration

### Path Aliases
- `@/*` maps to `./src/*` for clean imports

### TypeScript Configuration
- Target: ES2017
- Strict mode enabled
- Module resolution: bundler
- JSX: preserve

## Application Features

### KICE Software Architect Question Bank
이 애플리케이션은 KICE Software Architect 시험 대비 문제 은행입니다.

#### 1. 예상문제 개요 표
- PDF에서 추출한 시험 구조 테이블
- 5개 대모듈: 핵심(3문항/11점), 설계구축(6문항/22점), 운영문제해결(6문항/32점), 환경(4문항/14점), 신기술(6문항/21점)
- 총 25문항 100점 만점 구조
- 각 소모듈별 주요 주제와 학습 포인트 표시

#### 2. 실제 기출문제 (33문항)
- PDF에서 자동 추출된 완전한 문제 세트
- 각 문제별 포함 정보:
  - 문제 번호 및 제목
  - 난이도 (하급/중급/상급) 및 점수 (3-5점)
  - 완전한 문제 텍스트 (선택지 포함)
  - 정답 (①~⑤)
  - 상세 해설
  - 자동 추출된 키워드

#### 3. 검색 및 필터링 기능
- 전체 텍스트 검색: 제목, 문제 내용, 키워드 검색
- 모듈별 필터링
- 실시간 검색 결과 카운트

#### 4. 사용자 인터페이스
- 접을 수 있는 카드 형태의 문제 표시
- 컬러 코딩된 난이도 및 점수 뱃지
- 반응형 디자인 (모바일/데스크톱)
- Tailwind CSS를 사용한 현대적인 UI

### Data Processing Pipeline
1. **PDF 추출**: `pdf-parse` 라이브러리로 PDF → 텍스트 변환
2. **구조화**: 정규식과 패턴 매칭으로 문제, 답안, 해설 분리
3. **키워드 추출**: 자동 패턴 매칭으로 기술 키워드 추출
4. **JSON 변환**: 웹 애플리케이션에서 사용할 수 있는 구조화된 데이터

### Development Workflow

#### 새로운 PDF 문제 추가 시:
```bash
# 1. PDF를 raw-data/ 폴더에 저장
# 2. PDF에서 텍스트 추출
node scripts/extract-pdf.js

# 3. 문제 구조화
node scripts/extract-all-questions.js

# 4. (필요시) 문제 표 구조 업데이트
node scripts/extract-question-table.js

# 5. 개발 서버에서 확인
npm run dev
```

#### 현재 데이터 상태:
- **추출 완료**: 33개 기출문제 (118점)
- **구조화 완료**: 예상문제 개요 테이블 (25문항 100점 구조)
- **키워드**: JVM, Spring, Kafka, Kubernetes, JavaScript 등 자동 태깅

### 향후 확장 계획
1. **추가 PDF 처리**: 기출문제, 참고자료 PDF 추가 추출
2. **문제 분류 개선**: AI 기반 자동 분류 및 태깅
3. **학습 기능**: 즐겨찾기, 오답노트, 진도 추적
4. **모바일 최적화**: PWA 지원, 오프라인 학습
5. **검색 고도화**: 벡터 기반 의미론적 검색

## GitHub Pages Deployment
- Repository name: kice-swa
- Static export configured with `output: 'export'` in next.config.ts
- Base path and asset prefix set to `/kice-swa` for production
- GitHub Actions workflow in `.github/workflows/deploy.yml` for automatic deployment
- Images configured with `unoptimized: true` for static export compatibility