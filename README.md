# CELC custom dashboard

This repo holds all the code for the CELC custom dashboard.

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
pnpm install
```

Then, to run the website + api:

```
pnpm run dev
```

You can modify your code and hot reload will reload the website for you.
