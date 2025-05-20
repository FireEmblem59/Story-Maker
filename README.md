# Story Maker

A web application for writing and managing stories with AI-powered assistance. Built with React, TypeScript, and TailwindCSS.

## Features

- Create and manage multiple stories
- Organize content into chapters
- AI-powered writing assistance:
  - Clarify text
  - Enrich content with imagery
  - Polish grammar and spelling
  - Generate new chapters from prompts
- Clean, responsive UI
- Local storage for saving stories

## Tech Stack

- React + TypeScript
- TailwindCSS for styling
- Zustand for state management
- Google PaLM/Gemini API for AI features
- Vite as the build tool

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your Google API key:
   ```
   VITE_GOOGLE_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
  ├── components/         # React components
  │   ├── StorySidebar.tsx
  │   └── ChapterEditor.tsx
  ├── store.ts           # Zustand store
  ├── App.tsx           # Main app component
  ├── main.tsx          # Entry point
  └── index.css         # Global styles
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

MIT
