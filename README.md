# Progress Path Planner (Cuphead Assistant)

A strategic management and pathfinding tool designed for Cuphead players. Optimize your loadouts, track your progression, and receive tactical advice for every encounter on Inkwell Isle.

## Project Structure

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

## Getting Started

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

## Testing

- **Unit Tests**: `npm run test`
- **E2E Tests**: `npx playwright test`
