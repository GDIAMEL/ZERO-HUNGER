const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const WEATHERSTACK_API_KEY = process.env.WEATHERSTACK_API_KEY;

app.get('/api/weather', async (req, res) => {
    const location = req.query.location;
    if (!location) return res.status(400).json({ error: 'Location required' });

    try {
        const response = await fetch(`http://api.weatherstack.com/current?access_key=${WEATHERSTACK_API_KEY}&query=${encodeURIComponent(location)}`);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));