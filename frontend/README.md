# Portfolio frontend

The Next.js frontend for the portfolio. For full project setup, including the
Go backend, see the [root README](../README.md).

## Requirements

- Node.js 20.9 or newer
- npm

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The home page requests the
health status from the Go API at `http://localhost:8080/api/health`; run the
backend alongside the frontend to see a connected status.

Application routes live under `src/app`, and shared UI components live under
`src/components`.

## Scripts

```bash
npm run dev     # Start the development server
npm run lint    # Run ESLint
npm run build   # Create a production build
npm run start   # Serve a completed production build
```

## Routes

- `/`
- `/about`
- `/projects`
- `/contact`

## Publishing note

Replace `hello@example.com` in `src/app/contact/page.tsx` with the correct email
address before deployment.
