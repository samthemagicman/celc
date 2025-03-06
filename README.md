# CELC custom dashboard

This repo holds all the code for the CELC custom dashboard, which is a calendar for the 2024 CELC event. It includes an auto-layout calendar with Discord login, event tracking, and an admin dashboard fir==or event editing/adding.

The stack is:

- pnpm as a package manager + monorepo
- Drizzle + sqlite for the database
- tRPC for API-like server code

The website is built on:

- [Tanstack Router](https://tanstack.com/router)
- [Tailwind CSS](https://tailwindcss.com/)

# Running the project

First install the dependencies:

```
npm install -g pnpm
```

```
pnpm install
```

Then, to run the website + api:

Before running the page, we need to create the database

```
npm install -g dotenv-cli
```

pnpm run db:push

```
Getting all db stuff
pnpm --filter @repo/database install
pnpm --filter @repo/trpc --filter website --filter api --filter @repo/types install
```

npm install -g dotenv

```
pnpm run dev
```

You can modify your code and hot reload will reload the website for you.

To run db
pnpm run db:studio

run webapp
pnpm run dev
