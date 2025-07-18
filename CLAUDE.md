# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application created with `create-next-app`, using TypeScript and Tailwind CSS. The project follows the Next.js App Router pattern and includes modern React 19 features with AWS Amplify UI components.

## Key Commands

- **Development**: `npm run dev` - Starts the development server with Turbopack
- **Build**: `npm run build` - Creates production build
- **Start**: `npm run start` - Starts production server
- **Lint**: `npm run lint` - Runs ESLint with Next.js configuration

## Architecture

### Directory Structure

- `src/app/` - App Router directory containing pages and layouts
- `src/app/layout.tsx` - Root layout with font configuration (Geist Sans/Mono)
- `src/app/page.tsx` - Home page component
- `src/app/globals.css` - Global styles with Tailwind CSS and CSS variables
- `public/` - Static assets (SVG icons for Next.js, Vercel, etc.)

### Technology Stack

- **Framework**: Next.js 15.4.1 with App Router
- **Runtime**: React 19.1.0
- **UI Components**: AWS Amplify UI React v6.11.2
- **Backend**: AWS Amplify v6.15.3
- **Styling**: Tailwind CSS v4 with PostCSS
- **Language**: TypeScript with strict mode
- **Linting**: ESLint with Next.js and TypeScript configurations
- **Fonts**: Geist Sans and Geist Mono from Google Fonts

### Configuration

- TypeScript path aliases: `@/*` maps to `./src/*`
- ESLint extends Next.js core-web-vitals and TypeScript rules
- Tailwind CSS configured with CSS variables for theming
- Next.js configuration is minimal (default settings)

### Styling System

- Uses CSS variables for theme colors (`--background`, `--foreground`)
- Supports dark mode via `prefers-color-scheme`
- Tailwind CSS integrated with custom theme variables
- Font variables defined in root layout and available globally

### AWS Amplify Integration

- **UI Components**: Pre-built React components from `@aws-amplify/ui-react`
- **Core Library**: AWS Amplify SDK for backend services integration
- **Authentication**: Can be configured with Amplify Auth components
- **Theming**: Amplify UI components support custom theming alongside Tailwind CSS
- **Documentation**: https://docs.amplify.aws/nextjs/build-ui/
