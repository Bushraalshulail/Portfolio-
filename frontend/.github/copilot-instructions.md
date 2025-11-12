# Copilot Instructions for Gym Finder Riyadh Design

## Project Overview
- **Gym Finder Riyadh Design** is a React + Vite + Tailwind CSS web app for discovering gyms in Riyadh.
- The UI and UX are based on a Figma design (see README for link).
- All content and UI are RTL (Arabic), with some English for code and data.

## Architecture & Key Files
- Main entry: `src/App.tsx` (handles routing, state, and page selection)
- Pages: `src/components/pages/` (e.g., `AuthPage.tsx`, `GymDetailsPage.tsx`, `HomePage.tsx`)
- UI components: `src/components/ui/` (Radix UI wrappers, custom controls)
- Data: `src/data/gyms.ts` (mock gym data, imported as `mockGyms`)
- Assets: Figma images referenced as `figma:asset/...` imports
- Styles: Tailwind via `index.css` and `styles/globals.css`

## Patterns & Conventions
- **RTL layout**: All main containers use `dir="rtl"` and Arabic text for user-facing content.
- **Component structure**: Pages are composed of UI components (cards, buttons, badges, etc.) from `ui/`.
- **Icons**: Uses `lucide-react` for all icons, mapped to gym facilities/equipment.
- **State management**: Local React state only (no Redux, no Context API).
- **Mock authentication**: Login is simulated in `AuthPage.tsx` and `App.tsx` (no backend/API calls).
- **Data flow**: `App.tsx` manages gym filtering/search and passes props to child components.
- **Styling**: Tailwind utility classes, with custom gradients and overlays for visual polish.
- **Figma assets**: Images and logos are imported using the `figma:asset/...` syntax.

## Developer Workflows
- **Install dependencies**: `npm i`
- **Start dev server**: `npm run dev` (Vite)
- **Build for production**: `npm run build`
- No test scripts or test files present.
- No API/server integration; all data is local and static.

## Integration Points
- **Radix UI**: Used for advanced UI primitives (accordion, dialog, etc.) in `ui/`.
- **Lucide React**: Icons for facilities, equipment, and UI elements.
- **Embla Carousel, Recharts, Sonner**: Available for advanced UI, but not always used in every component.

## Examples
- **GymCard**: See `src/components/GymCard.tsx` for facility/equipment icon mapping and card layout.
- **AuthPage**: See `src/components/pages/AuthPage.tsx` for login flow and RTL form design.
- **App.tsx**: Central state, search/filter logic, and page switching.

## Special Notes
- **Arabic-first**: All user-facing text is Arabic; code and data may mix English/Arabic.
- **No routing library**: Page selection is managed via state, not React Router.
- **No backend**: All data is static; add new gyms via `src/data/gyms.ts`.
- **Custom gradients**: See Tailwind classes like `bg-gradient-to-br`, `gradient-mint-card`.

---

If any conventions or workflows are unclear, please ask for clarification or examples from the codebase.