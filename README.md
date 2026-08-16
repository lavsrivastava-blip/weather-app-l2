# Weather Intelligence App

This is a Weather Intelligence App generated via Google AI Studio App Build for the AI Native App Building – Level 2 assignment. It leverages the public Open-Meteo APIs to provide current weather data, 7-day forecasts, and simple planning recommendations based on city searches.

## Setup and Run Locally
1. Clone this repository.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the local development server.
4. Run `npm run build` to test the production build.

## AI Studio to GitHub Connection
This repository was connected directly from the Google AI Studio App Build interface. 
- Generated source code was pushed to the `main` branch.
- No sensitive client data, employee data, or private API keys are included in this project. 

## Cloudflare Pages Deployment Instructions
This app is designed to be deployed directly to Cloudflare Pages:
1. Log into Cloudflare and navigate to **Workers & Pages**.
2. Click **Create Application** -> **Pages** -> **Connect to Git**.
3. Select this GitHub repository.
4. Apply the following build settings:
   - **Framework preset:** None / Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Click **Save and Deploy**.

## API Integration
This application exclusively utilizes the following public endpoints:
* **Geocoding API:** `https://geocoding-api.open-meteo.com/v1/search`
* **Forecast API:** `https://api.open-meteo.com/v1/forecast`
