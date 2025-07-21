const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests, please try again later' }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Environment variables validation
const WEATHERSTACK_API_KEY = process.env.WEATHERSTACK_API_KEY;
if (!WEATHERSTACK_API_KEY) {
    console.error('WEATHERSTACK_API_KEY is required in .env file');
    process.exit(1);
}

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Weather API endpoint with enhanced error handling
app.get('/api/weather', async (req, res) => {
    const { location } = req.query;
    
    // Input validation
    if (!location) {
        return res.status(400).json({ 
            error: 'Location parameter is required',
            example: '/api/weather?location=Nairobi'
        });
    }

    if (location.length > 100) {
        return res.status(400).json({ 
            error: 'Location parameter too long (max 100 characters)' 
        });
    }

    try {
        console.log(`Fetching weather for: ${location}`);
        
        const weatherUrl = `http://api.weatherstack.com/current?access_key=${WEATHERSTACK_API_KEY}&query=${encodeURIComponent(location)}&units=m`;
        
        const response = await fetch(weatherUrl, {
            timeout: 10000, // 10 second timeout
            headers: {
                'User-Agent': 'AgriPredict-AI/1.0'
            }
        });

        if (!response.ok) {
            throw new Error(`Weather API returned ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Check for API errors
        if (data.error) {
            console.error('Weatherstack API error:', data.error);
            return res.status(400).json({ 
                error: 'Weather data unavailable',
                details: data.error.info || 'Invalid location or API issue'
            });
        }

        // Validate response structure
        if (!data.current) {
            console.error('Invalid weather response structure:', data);
            return res.status(502).json({ 
                error: 'Invalid weather data received' 
            });
        }

        // Transform and enhance the response
        const weatherData = {
            location: {
                name: data.location?.name || location,
                country: data.location?.country || 'Unknown',
                region: data.location?.region || 'Unknown',
                coordinates: {
                    lat: data.location?.lat || null,
                    lon: data.location?.lon || null
                }
            },
            current: {
                temperature: data.current.temperature || 0,
                humidity: data.current.humidity || 0,
                wind_speed: data.current.wind_speed || 0,
                wind_direction: data.current.wind_dir || 'N/A',
                precip: data.current.precip || 0,
                pressure: data.current.pressure || 0,
                visibility: data.current.visibility || 0,
                uv_index: data.current.uv_index || 0,
                weather_descriptions: data.current.weather_descriptions || ['Unknown'],
                weather_icons: data.current.weather_icons || [],
                is_day: data.current.is_day === 'yes',
                observation_time: data.current.observation_time || new Date().toISOString()
            },
            timestamp: new Date().toISOString()
        };

        console.log(`✅ Weather data retrieved for ${weatherData.location.name}`);
        res.json(weatherData);

    } catch (error) {
        console.error('❌ Weather API error:', error.message);
        
        // Handle different types of errors
        if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
            return res.status(503).json({ 
                error: 'Weather service temporarily unavailable',
                retry_after: 60
            });
        }

        if (error.name === 'AbortError' || error.code === 'ETIMEDOUT') {
            return res.status(504).json({ 
                error: 'Weather service timeout',
                retry_after: 30
            });
        }

        res.status(500).json({ 
            error: 'Failed to fetch weather data',
            message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Fallback weather data for offline/demo mode
app.get('/api/weather/demo', (req, res) => {
    const { location = 'Demo Location' } = req.query;
    
    const demoData = {
        location: {
            name: location,
            country: 'Kenya',
            region: 'Central',
            coordinates: { lat: -0.0236, lon: 37.9062 }
        },
        current: {
            temperature: Math.floor(Math.random() * 10) + 20,
            humidity: Math.floor(Math.random() * 30) + 60,
            wind_speed: Math.floor(Math.random() * 15) + 5,
            wind_direction: 'NE',
            precip: Math.floor(Math.random() * 20),
            pressure: 1013,
            visibility: 10,
            uv_index: Math.floor(Math.random() * 8) + 1,
            weather_descriptions: ['Partly Cloudy'],
            weather_icons: ['https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'],
            is_day: true,
            observation_time: new Date().toISOString()
        },
        timestamp: new Date().toISOString(),
        demo: true
    };

    res.json(demoData);
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Endpoint not found',
        available_endpoints: [
            'GET /health',
            'GET /api/weather?location=<location>',
            'GET /api/weather/demo?location=<location>'
        ]
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
    console.log(`AgriPredict AI server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Weather API: http://localhost:${PORT}/api/weather?location=Nairobi`);
});

// Handle server errors
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
    } else {
        console.error('Server error:', error);
    }
    process.exit(1);
});

module.exports = app;
