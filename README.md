# Progress Path Planner (Cuphead Assistant)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Redux](https://img.shields.io/badge/Redux-Toolkit-purple.svg)](https://redux-toolkit.js.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646cff.svg)](https://vitejs.dev/)

A strategic management and pathfinding tool designed for Cuphead players. Optimize your loadouts, track your progression, and receive tactical advice for every encounter on Inkwell Isle.

![Menu](presentation/images/menu.jpg)

## 🚀 Key Features

- **Arsenal Management**: Track weapon ownership and specialized skills with real-time coin balance calculation.
- **Dynamic Loadout Builder**: Create, modify, and manage custom tactical contracts.
- **Combat Strategy Consultant**: AI-driven pathfinding logic that suggests the best equipment for specific bosses based on your current progression.
- **World Tracking**: Detailed monitoring of world exploration status and coin collection.
- **Responsive Design**: Fully adaptive interface designed for both desktop and mobile "run and gun" sessions.

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **State**: Redux Toolkit (Slices + Async Thunks)
- **Styling**: Tailwind CSS + CSS Modules
- **UI**: Radix UI + Lucide Icons
- **Animation**: Framer Motion

### Backend
- **Server**: Node.js + Express 5
- **Database**: PostgreSQL (pg)
- **Security**: Parameterized queries + Zod validation
- **Deployment**: Configured for Amvera and Heroku

## 🏗 Project Structure

```text
├── src/
│   ├── app/          # Store configuration and global hooks
│   ├── features/     # Feature-based decomposition (Redux slices + Components)
│   │   ├── profile/  # User stats and wallet logic
│   │   ├── planner/  # Combat strategy engine
│   │   └── loadouts/ # Equipment management
│   ├── api/          # Strongly typed API service layer
│   └── components/   # Shared UI components (Shadcn/UI base)
├── server/           # Express backend logic
└── tests/            # E2E (Playwright) and Unit (Jest) tests
```

## 🚥 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL instance (local or remote)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`:
   ```env
   DATABASE_URL=postgres://user:password@localhost:5432/cuphead
   ```
4. Initialize the database:
   ```bash
   npm run init-db
   ```
5. Start development servers:
   ```bash
   npm run dev    # Starts frontend
   npm run server # Starts backend
   ```

## 🧪 Testing

- **Unit Tests**: `npm run test`
- **E2E Tests**: `npx playwright test`

## 🎨 Design & Mockups

The project follows a "Vintage Rubber-Hose" design system adapted for modern interfaces.
- **Color Palette**: Cyberpunk-inspired HSL tokens.
- **Typography**: Inter (UI) and Mono (Stats).
- **Mockups**: View design system details in the `presentation/` directory.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
