# AI Image Mixer - Project Instructions

## Project Overview
AI Image Mixer is a high-performance, single-page web application built with **Next.js 16 (App Router)** and **React 19**. It enables users to upload two source images, which are then processed by an external AI workflow via an n8n webhook. The application focuses on a minimalist, premium e-commerce aesthetic with high-contrast UI elements.

### Core Technology Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **State Management:** React Hooks (Functional Components)
- **External Integration:** n8n Webhook (configured via `.env.local`)

## Configuration
Before running the application, create a `.env.local` file in the root directory with the following variable:
```env
NEXT_PUBLIC_WEBHOOK_URL=https://andro095.app.n8n.cloud/webhook/d8c73a05-57b4-4807-a623-331231c401bc
```

## Building and Running
All commands should be executed from the project root.

- **Development Server:** `npm run dev` (Default: http://localhost:3000)
- **Production Build:** `npm run build`
- **Production Start:** `npm run start`
- **Linting:** `npm run lint`

## Project Structure
- `src/app/`: Contains the Next.js App Router structure.
  - `page.tsx`: The main entry point rendering the Image Mixer.
  - `layout.tsx`: Root layout featuring the global navigation and dark header.
- `src/components/`: Reusable UI components.
  - `ImageMixer.tsx`: Core application logic, state management, and API integration.
- `public/`: Static assets.

## Development Conventions

### 1. API Integration & Security
The application communicates with a webhook that returns **raw binary data** (not JSON). 
- **Environment Variables:** The webhook URL must be stored in `NEXT_PUBLIC_WEBHOOK_URL`.
- **Blob Handling:** Always parse the response as a `Blob` and use `URL.createObjectURL(blob)`.
- **Memory Management:** Mandatory cleanup using `URL.revokeObjectURL` within a `useEffect` cleanup function to prevent memory leaks.

### 2. File Validation & Robustness
- **Size Limit:** Files are capped at **5MB** on the client side.
- **Type Restriction:** Only `image/*` MIME types are accepted.
- **Error Handling:** UI provides feedback for large files, wrong types, or missing configuration.

### 3. State Management
- Use `useState` for UI states (loading, errors, previews).
- Use `useRef` for accessing hidden file inputs.
- Keep the `ImageMixer.tsx` component as a client-side component (`'use client'`).

### 4. Styling Guidelines
- Follow the high-contrast aesthetic: Black backgrounds for headers, white backgrounds for main content.
- Use uppercase, tracking-wide typography for buttons and headers (e.g., `font-bold uppercase tracking-widest`).
- Use thin black borders for interactive elements (buttons, zones).

### 5. Next.js 16 Compatibility
This project uses a cutting-edge version of Next.js. Refer to `AGENTS.md` for specific agent rules regarding breaking changes and API differences from older versions.
