# AI Image Mixer

Build a single-page frontend application that allows a user to upload two images, sends them to a webhook for processing, and displays the resulting generated image.

## Tech Stack
* **Framework:** Next.js 16 (App Router)
* **Styling:** Tailwind CSS 4
* **State Management:** React 19 Hooks
* **HTTP Client:** Native `fetch` API

## Getting Started

### 1. Prerequisites
- Node.js 18+
- npm

### 2. Configuration
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-uuid
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Installation
```bash
npm install
```

### 4. Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

## Security & Robustness
- **Environment Variables:** Sensitive webhook URLs are kept out of source control via `.env.local`.
- **Client-side Validation:** 
  - Max file size: 5MB
  - File types: `image/*` only
- **Memory Safety:** Binary data (Blobs) are automatically cleaned up from browser memory on component unmount or image change.

## Project Instructions
For detailed architectural guidance and coding conventions, see [GEMINI.md](GEMINI.md).
