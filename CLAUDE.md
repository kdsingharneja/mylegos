# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

**✅ MVP COMPLETED!** The core MyLegos application is now fully functional with:
- Next.js 14 + TypeScript setup with all dependencies
- Vercel Postgres database schema deployed
- Rebrickable API integration for LEGO data
- Responsive grid display with Mantine UI
- Add/delete sets with API validation
- Real-time search and sorting
- Complete error handling and loading states

## Planned Architecture

MyLegos will be a Next.js 14 TypeScript application for personal LEGO set inventory tracking with these key characteristics:

### Core Design Philosophy
- **Minimal Storage**: Database stores only LEGO set numbers as identifiers
- **Real-time Data**: All display information (names, images, piece counts) fetched from Rebrickable API
- **Simplicity First**: Clean interface focused on essential functionality

### Planned Tech Stack
- Next.js 14 with App Router and TypeScript
- TailwindCSS + Mantine UI v7 for styling/components  
- Vercel Postgres + Prisma ORM
- React Query for API state management + Zustand for local state
- React Hook Form + Zod for form validation
- Rebrickable API integration for LEGO data

### Database Design
Simple schema with single `sets` table storing only:
- `set_number` (primary identifier)
- Timestamps for tracking

### Key Integration Points
- **Rebrickable API**: `https://rebrickable.com/api/v3/lego/sets/{set_number}/`
- **Shared Database**: Vercel Postgres for both development and production
- **Environment Variables**: `DATABASE_URL` and `REBRICKABLE_API_KEY` required

## Development Commands

```bash
npm run dev          # Development server (http://localhost:3000 or 3001)
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint checking
npm run typecheck    # TypeScript type checking
npm run db:push      # Database schema updates
npm run db:generate  # Prisma client generation
npm run import:csv   # Import sets from CSV file
```

## Using the Application

### Adding Sets
1. Click "Add Set" button in the header
2. Enter LEGO set number (e.g., 21034, 75192, 10280)
3. System validates against Rebrickable API
4. Preview set details and confirm to add

### Importing from CSV
To import your existing collection from a CSV file:
```bash
npm run import:csv path/to/your/sets.csv
```

CSV should have a column named `setNumber`, `set_number`, or `Set Number`

### Features Available
- ✅ Add/remove sets with API validation
- ✅ Real-time search by set number or name
- ✅ Sort by date, name, year, or set number
- ✅ Responsive design (mobile-first)
- ✅ Loading states and error handling
- ✅ LEGO-inspired color scheme