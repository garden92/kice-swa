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
  - `page.tsx` - Home page component
  - `globals.css` - Global styles with Tailwind directives
- `public/` - Static assets served at root path
- `raw-data/` - PDF documents (기출문제, 예상문제, 참고 자료)

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

## GitHub Pages Deployment
- Repository name: kice-swa
- Static export configured with `output: 'export'` in next.config.ts
- Base path and asset prefix set to `/kice-swa` for production
- GitHub Actions workflow in `.github/workflows/deploy.yml` for automatic deployment
- Images configured with `unoptimized: true` for static export compatibility