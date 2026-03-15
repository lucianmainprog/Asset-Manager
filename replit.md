# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains TechJourney — an IT learning and career mobile platform similar to SoloLearn/Mimo but expanded with career paths, certifications, and coding challenges.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Mobile**: Expo (React Native) with Expo Router file-based routing

## Project: TechJourney

A mobile learning platform built with Expo/React Native featuring:

### Features
- **Home** screen: Daily challenge, XP progress bar, streak tracker, continue learning, stats
- **Learn** tab: 6 programming courses (HTML, CSS, JS, Python, C#, C++) with lesson content, code examples, quizzes
- **Careers** tab: 6 IT career paths with job roles, salary data, skills, certifications, roadmaps
- **Challenges** tab: Coding challenges with code editor, hints, difficulty filters
- **Profile** tab: XP/level system, achievements, stats, editable name

### Gamification
- XP points earned per lesson (+50-100 XP) and challenge (+75-200 XP)
- Level system (every 200 XP per level)
- Day streak tracking
- Achievement badges (6 achievements)

### UI Theme
- Dark: midnight navy (#050C1A) bg with electric cyan (#00D4FF) accent
- Light: soft blue (#F0F4FF) bg with deep navy (#1E3A8A) accent
- Font: Inter (400/500/600/700)
- Icons: @expo/vector-icons (Feather set)
- Native tabs with liquid glass on iOS 26+

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── mobile/             # TechJourney Expo app
│       ├── app/
│       │   ├── _layout.tsx         # Root layout + providers
│       │   ├── (tabs)/             # 5 main tabs
│       │   │   ├── _layout.tsx     # Tab bar config (NativeTabs + Classic)
│       │   │   ├── index.tsx       # Home screen
│       │   │   ├── learn.tsx       # Course list
│       │   │   ├── careers.tsx     # Career explorer
│       │   │   ├── challenges.tsx  # Coding challenges list
│       │   │   └── profile.tsx     # User profile + achievements
│       │   ├── lesson/[courseId].tsx   # Lesson detail + quiz
│       │   ├── challenge/[id].tsx      # Challenge detail + code editor
│       │   └── career/[id].tsx         # Career detail page
│       ├── components/
│       │   ├── CourseCard.tsx
│       │   ├── ChallengeCard.tsx
│       │   ├── XPBar.tsx
│       │   ├── StreakDisplay.tsx
│       │   ├── ErrorBoundary.tsx
│       │   └── ErrorFallback.tsx
│       ├── context/
│       │   └── AppContext.tsx    # Global state + AsyncStorage
│       └── constants/
│           └── colors.ts        # Light/dark theme
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
└── scripts/                # Utility scripts
```

## Data

Currently uses AsyncStorage for local persistence. State managed through React Context (`AppContext`).

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

- **Always typecheck from the root** — run `pnpm run typecheck`
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references
