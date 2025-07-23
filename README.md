# AgriPredict AI - Smart Farming Solutions

AgriPredict AI is an integrated web and AI platform designed to empower smallholder farmers and agricultural stakeholders with smart, data-driven tools for yield prediction, weather monitoring, farm analytics, and actionable recommendations. The project harnesses modern web technologies and machine learning to provide an intuitive dashboard, interactive map, chatbot assistant, and advanced crop yield prediction models for sustainable agriculture and food security.

---

## Table of Contents

- [Features](#features)
- [Architecture & Key Files](#architecture--key-files)
- [Technologies Used](#technologies-used)
- [Backend & Models](#backend--models)
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

### Frontend

<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" height="30"/>
<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" height="30"/>
<img src="https://img.shields.io/badge/React.js-61DAFB?style=for-the-badge&logo=react&logoColor=black" height="30"/>
<img src="https://img.shields.io/badge/Font%20Awesome-339AF0?style=for-the-badge&logo=fontawesome&logoColor=white" height="30"/>
<img src="https://img.shields.io/badge/Chart.js-F5788D?style=for-the-badge&logo=chartdotjs&logoColor=white" height="30"/>
<img src="https://img.shields.io/badge/Recharts-FF6F61?style=for-the-badge&logo=recharts&logoColor=white" height="30"/>
<img src="https://img.shields.io/badge/Leaflet.js-199900?style=for-the-badge&logo=leaflet&logoColor=white" height="30"/>

### Data Science and AI

<img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" height="30"/>
<img src="https://img.shields.io/badge/Pandas-150458?style=for-the-badge&logo=pandas&logoColor=white" height="30"/>
<img src="https://img.shields.io/badge/Jupyter-F37626?style=for-the-badge&logo=jupyter&logoColor=white" height="30"/>
<img src="https://img.shields.io/badge/pandas--profiling-003B57?style=for-the-badge&logo=python&logoColor=white" height="30"/>

> Planned: Model training, evaluation, and inference via RESTful APIs.

### Planned Integrations

<img src="https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=java&logoColor=white" height="30"/>
<img src="https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" height="30"/>
<img src="https://img.shields.io/badge/REST%20API-FF6F00?style=for-the-badge&logo=api&logoColor=white" height="30"/>
<img src="https://img.shields.io/badge/Weather%20API-1E90FF?style=for-the-badge&logo=OpenWeather&logoColor=white" height="30"/>
<img src="https://img.shields.io/badge/AI--Driven%20Prediction-FF4081?style=for-the-badge&logo=tensorflow&logoColor=white" height="30"/>



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
