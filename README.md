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

#### 1. Clone the repo:

```bash
git clone git@github.com:martekn/bidquest.git
```

#### 2. Install the dependencies:

```bash
npm install
```

### Environment Variable Setup

To run the application, you only need to set up the `VITE_API_KEY` variable. For testing, you will need to set up additional environment variables.

#### 1. Copy `.env.example`

Copy the contents of the `.env.example` file into a new file named `.env`.

#### 2. Generate API Key

Visit the [Noroff API Documentation](https://docs.noroff.dev/docs/v2/auth/api-key) to learn how to generate an API key.

#### 3. Environment Variables

Fill out the following environment variables in the `.env` file:

- **For running the application**:

  - `VITE_API_KEY`: Your API key generated from Noroff.

- **For testing**:
  - `VITE_API_KEY`: Your API key generated from Noroff.
  - `VITE_TOKEN`: A JWT token generated for testing purposes.
  - `USER_NAME`: The username of a registered user for testing.
  - `USER_EMAIL`: The email address of the registered user.
  - `USER_PASSWORD`: The password of the registered user.

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

```bash
npm run build
npm run test:e2e
```

#### Lint with [ESLint](https://eslint.org/)

```bash
npm run lint
```

## Contributing

If you have any feedback or suggestions to make the project better, please create an issue or fork the repo and create a pull request.

## Contact

You can contact me on [linkedIn](https://www.linkedin.com/in/martekn/) or send an email to marte.mk@hotmail.com
