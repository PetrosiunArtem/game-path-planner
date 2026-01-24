# Progress Path Planner (MVP)

A strategic planning tool for the Cuphead game, helping players optimize their loadouts and boss order.

## Features

- **Profile Management**: Track weapon ownership, skill levels, and boss progress.
- **Loadout Planner**: Create and manage custom weapon loadouts.
- **Strategy Advisor**: Get AI-powered suggestions for boss encounters based on your stats.
- **Progress Tracking**: Visualize your completion status.

## Tech Stack

- **Framework**: React (Vite)
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI (Headless)
- **Testing**: Jest, Playwright

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Run Mock API (simulated within the app):
   The application uses a local mock API layer (`src/api/mockApi.ts`) to simulate backend operations.

## Scripts

- `npm run dev`: Start dev server
- `npm run build`: Build for production
- `npm run preview`: Preview build
- `npm test`: Run Unit/Integration tests
- `npm run lint`: Run ESLint

## Project Structure

- `src/features`: Redux slices and feature-specific logic.
- `src/components`: Reusable UI components.
- `src/pages`: Main application pages.
- `src/api`: Mock API service.

## Screenshots

## Screenshots

![Menu](presentation/images/menu.jpg)
![Profile](presentation/images/profile.jpg)
![Find Path](presentation/images/find_path.jpg)

## Presentation
A presentation is available in `presentation/marp-cuphead_Version3.md`.


## License

MIT
