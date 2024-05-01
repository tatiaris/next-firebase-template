# TS Next Firebase Template
Web development starter pack containing essentials with minimal dependencies

## Built with
- [Next.js](https://nextjs.org/docs/pages)
- [Firestore](https://firebase.google.com/docs/firestore)

## Features
- Typed
- Signup / Login functionality
- Session management
- Multi-theme support
- Admin CRUD actions
- Firestore helper functions
- [Linting](https://eslint.org/docs/latest/)
- [Formatting](https://prettier.io/docs/en/)
- [Unit testing](https://jestjs.io/docs/getting-started)
- [Integration testing](https://docs.cypress.io/guides/overview/why-cypress)
- [Pre-commit hooks](https://typicode.github.io/husky/how-to.html)

## Run locally
Create and populate `.env.local` using `.env.sample`
```bash
# install dependencies
npm install
# start local server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the result

## Project structure
- `src/pages/*` - all unique pages accross the website

- `src/pages/api/*` - next.js API endpoints

- `src/components/*` - reusable jsx components

- `src/util/*` - utility functions (ex: [firestore](https://firebase.google.com/docs/firestore))

- `__tests__/*` - jest unit tests

- `cypress/*` - cypress integration tests

- `public/*` - static assets (ex: images)
