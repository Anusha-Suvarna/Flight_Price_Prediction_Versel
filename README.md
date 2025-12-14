# Flight Price Prediction

An end-to-end machine learning web application to predict flight ticket prices using historical data. Built with Extra Trees Regressor achieving 96.33% accuracy.

## Features

- **ML Model**: Trained on Indian flight data with features like airline, route, date/time, stops, duration
- **Modern Web UI**: React frontend with a classy, game-inspired design (PUBG style dark theme)
- **Real-time API**: Serverless Python API serving predictions via REST API
- **Production Ready**: Containerized and deployable to cloud platforms

## Architecture

- **Frontend**: React.js with Material-UI, modern spa theme
- **Backend**: Serverless Python API on Vercel
- **Model**: Extra Trees Regressor pickled and loaded
- **Deployment**: Vercel with automatic builds and serverless functions

## Setup & Run

### Prerequisites

- Python 3.7+
- Node.js 14+

### Installation

1. **Clone the repo**:

   ```bash
   git clone <repository-url>
   cd Flight_Price_Prediction_vercel
   ```

2. **Backend Setup**:

   ```bash
   cd Flight_Deployment
   pip install -r requirements.txt
   py -3 app.py
   ```

   Flask runs on http://127.0.0.1:5000 (debug mode)

3. **Frontend (Optional for development)**:
   ```bash
   cd frontend
   npm install
   npm start
   ```
   React dev server runs on http://localhost:3000

### Production Build

1. Build React static files:

   ```bash
   cd frontend
   npm run build
   ```

2. Run Flask (serves React build):
   ```bash
   cd ../Flight_Deployment
   py -3 app.py
   ```
   App serves at http://127.0.0.1:5000

## Usage

1. Open http://127.0.0.1:5000
2. Fill flight details: date, times, duration, stops, airline, cities
3. Click "PREDICT PRICE"
4. View predicted price with ₹ currency

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Or push to GitHub and connect repo to Vercel for auto-deployment
5. The `vercel.json` handles build configuration automatically
6. App deployed at: https://your-app-name.vercel.app

### Manual Deployment

- Package model and requirements
- Use Docker or VPS with Python/Node setup

## Model Details

- **Algorithm**: Extra Trees Regressor
- **Accuracy**: 96.33%
- **Features**: 29 inputs (encoded airline, source/dest, date/time components)
- **Output**: Predicted price (₹ INR)

## Contact

Anusha S Suvarna - ML Project Portfolio

_This project demonstrates full-stack ML deployment with modern web technologies._
