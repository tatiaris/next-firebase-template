# Next Firebase Template
Web development essentials starter kit

## Built with
- [Next.js](https://nextjs.org/docs/pages) – Framework
- [Firestore](https://firebase.google.com/docs/firestore) – Cloud Platform
- [Tailwind](https://tailwindcss.com/) – UI

## Features
- Typed – [Typescript](https://www.typescriptlang.org/)
- Linting – [ESLint](https://eslint.org/docs/latest/)
- Formatting – [Prettier](https://prettier.io/docs/en/)
- Unit testing – [Jest](https://jestjs.io/docs/getting-started)
- E2E testing – [Playwright](https://playwright.dev)
- Hooks – [Husky](https://typicode.github.io/husky/how-to.html)
- Firebase authentication
- Multi-theme support
- Firestore helper functions

## Run locally
([Create Firebase project](https://console.firebase.google.com/) if you haven't already)

Create and populate `.env.local` using `.env.sample`
```bash
# install dependencies
yarn install
# start local server
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the result

## Folder structure
- `src/pages/*` - all pages accross the website

- `src/pages/api/*` - next.js API endpoints

- `src/components/*` - reusable components

- `src/util/*` - utility functions (ex: [firestore](https://firebase.google.com/docs/firestore))

- `tests/jest/*` - jest unit tests

- `tests/playwright/*` - playwright e2e tests

- `public/*` - static assets (ex: images)
