# AgriPredict AI - Smart Farming Solutions

AgriPredict AI is an integrated web and AI platform designed to empower smallholder farmers and agricultural stakeholders with smart, data-driven tools for yield prediction, weather monitoring, farm analytics, and actionable recommendations. The project harnesses modern web technologies and machine learning to provide an intuitive dashboard, interactive map, chatbot assistant, and advanced crop yield prediction models for sustainable agriculture and food security.

---

## Table of Contents

- [Features](#features)
- [Architecture & Key Files](#architecture--key-files)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Screenshots](#screenshots)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Features

- **AI-Powered Yield Prediction:**  
  Predict crop yields based on real farm data (soil, nutrients, weather, etc.) using a custom AI model ([CropYieldPredictor.jsx](#cropyieldpredictorjsx), [CROP_YIELD_PREDICTOR (1).ipynb](#crop_yield_predictor-1ipynb)).
- **Weather Dashboard:**  
  Real-time weather cards display temperature, humidity, wind speed, rainfall, and conditions for your selected region.
- **Interactive Map:**  
  Select your farm or area of interest on an integrated map (Leaflet.js), supporting location-based analytics.
- **Notifications & Alerts:**  
  Stay updated with recent weather alerts, pest warnings, and optimal harvest recommendations.
- **AI Chatbot Assistant:**  
  Get instant answers for best farming practices, crop management, and troubleshooting via the integrated chatbot.
- **Data Visualization & Farm Analytics:**  
  Visualize historical and predicted trends (e.g., yield, rainfall) using interactive charts powered by Chart.js and Recharts.
- **Automated Data Profiling:**  
  Quickly understand your dataset with in-depth profiling reports ([PANDAS_PROFILING_REPORT.html](#pandas_profiling_reporthtml)).
- **Responsive Design:**  
  Fully responsive and mobile-friendly for seamless usage in the field or office.

---

## Architecture & Key Files

- **[enhanced.html](enhanced.html):**  
  Main frontend application (HTML/CSS/JS) with login system, weather dashboard, map integration, chatbot, and panels for yield prediction and recommendations.

- **[CropYieldPredictor.jsx](CropYieldPredictor.jsx):**  
  Modern React component implementing an interactive, AI-based crop yield predictor. Allows input of farm and crop details, returns predictions, risks, recommendations, and visualizes weather and historical yield data.

- **[CROP_YIELD_PREDICTOR (1).ipynb](CROP_YIELD_PREDICTOR%20(1).ipynb):**  
  Python Jupyter Notebook outlining the AI/ML model logic for crop yield prediction, referencing feature engineering, risk assessment, and recommendations (original research/prototype).

- **[PANDAS_PROFILING_REPORT.html](PANDAS_PROFILING_REPORT.html):**  
  Automated exploratory data analysis report for the dataset, giving insights into data quality, distributions, and correlations.

- **`models/` directory:**  
  Placeholder for trained or in-development ML models powering the predictor.

---

## Technologies Used

- **Frontend:**  
  - HTML5, CSS3 (custom styles, responsive layouts)
  - [Font Awesome](https://fontawesome.com/) for icons
  - [Chart.js](https://www.chartjs.org/) and [Recharts](https://recharts.org/) for data visualization
  - [Leaflet.js](https://leafletjs.com/) for interactive maps
  - [React.js](https://react.dev/) for modern UI components

- **Data Science/AI:**  
  - Python, Pandas, Jupyter Notebooks
  - Automated data profiling (pandas-profiling)
  - (Planned) Model training and inference APIs

- **Planned Integrations:**  
  - Backend API for authentication and persistent data
  - Real weather and AI yield prediction APIs

---

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/GDIAMEL/ZERO-HUNGER.git
   cd ZERO-HUNGER
   ```

2. **Frontend Web App:**
   - Open `enhanced.html` in your web browser.
   - *Note: The app is currently frontend-only; backend features like login and real predictions are placeholders.*

3. **AI Predictor (React):**
   - To run the React component (`CropYieldPredictor.jsx`), integrate it into your React project or use the core logic for your own frontend.

4. **AI Model Notebook:**
   - Open `CROP_YIELD_PREDICTOR (1).ipynb` in Jupyter or Google Colab to inspect and experiment with the AI model logic.

5. **Data Profiling:**
   - View the `PANDAS_PROFILING_REPORT.html` in your browser for insights into your dataset.

---

## Screenshots

![AgriPredict AI Dashboard](AGRI%20AI.PNG)
*(Sample screenshot: main dashboard UI)*

---

## Roadmap

- Integrate backend API for authentication and persistent data
- Connect to real-time weather and AI prediction APIs
- Expand crop and region database
- Localize for multiple languages
- Add farmer community and forum features
- Enhance AI model accuracy and explainability

---

## Contributing

Contributions are welcome! Please open issues and pull requests to help improve the project.

---

## License

This project is released under the [MIT License](LICENSE).

---

## Acknowledgements

- Inspired by the United Nations' Zero Hunger initiative.
- Built with open source tools: React.js, Chart.js, Recharts, Leaflet.js, Font Awesome, Pandas, pandas-profiling.

---

*Smart tools for a sustainable, food-secure future!*
