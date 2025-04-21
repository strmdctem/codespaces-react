# FinRates

## Getting Started

Ensure that you have installed the project dependencies by running:

```bash
npm install
```

You can then run or build the project using the scripts below.

## Available Scripts

### `npm start`

Starts the development server using Vite.  
This will launch your app in development mode.

### `npm run build`

Builds the app for production using Vite.  
The production-ready files will be output to the `dist` directory.

### `npm run preview`

Launches a local server to preview the built production app.

### `npm run deploy`

Deploys the app to a sibling repository (assumed to be a GitHub Pages site in `../strmdctem.github.io`).  
This script adds, commits, and pushes changes to the `main` branch of that repository.

### `npm run prod:deploy`

Deploys the hosting portion of the project to Firebase using:

```bash
firebase deploy --only hosting
```

### `npm run deploy:both`

Runs both the `deploy` and `prod:deploy` scripts sequentially.  
Useful when you need to update both the GitHub Pages repository and Firebase hosting.

### `npm run deploy:full`

Runs a full deployment by first building the app, then running the `deploy:both` script.

### `npm run build:preview`

Builds the app and then starts the preview server to show the production build locally.
