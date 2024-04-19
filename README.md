# BidQuest

BidQuest is an online auction platform where users can buy and sell various items through auctions.

## Description

BidQuest is an online auction platform I've developed, aimed at simulating the buying and selling experience. While it's not intended for real transactions, it incorporates a range of functionalities commonly found in auction websites.

Users can engage with features like creating, editing, and viewing auction listings, as well as searching for specific items and managing bids. The site's design prioritizes simplicity and accessibility, with basic navigation options and straightforward interfaces.

## Built With

[![image](https://img.shields.io/badge/Vue%20js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)](https://vuejs.org/)
[![image](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## Getting Started

### Installing

1. Clone the repo:

```bash
git clone git@github.com:martekn/bidquest.git
```

2. Install the dependencies:

```bash
npm install
```

### Running

#### Compile and Hot-Reload for Development

```bash
npm run dev
```

#### Compile and Minify for Production

```bash
npm run build
```

#### Run Unit Tests with [Vitest](https://vitest.dev/)

```bash
npm run test:unit
```

#### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```bash
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

#### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Contributing

If you have any feedback or suggestions to make the project better, please create an issue or fork the repo and create a pull request.

## Contact

You can contact me on [linkedIn](https://www.linkedin.com/in/martekn/) or send an email to marte.mk@hotmail.com
