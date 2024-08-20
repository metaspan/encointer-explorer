# Encointer Explorer (Nuxt 3)

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install
```

## Environment Variables

Copy `.env.sample` to `.env` and adjust the values


## Production

Check app.config.ts

```bash
pm2 restart ecosystem.config.cjs
pm2 list
pm2 resurrect
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# yarn
yarn dev
```
