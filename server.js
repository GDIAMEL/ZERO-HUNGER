const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, query, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();

// Environment variables with validation
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || (() => {
    console.warn('Using default JWT_SECRET. Set JWT_SECRET in production!');
    return 'supersecretkey';
})();
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security middleware
app.use(helmet({
    contentSecurityPolicy: NODE_ENV === 'production' ? undefined : false
}));

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 login attempts per window
    message: { error: 'Too many login attempts, please try again later' },
    standardHeaders: true,
    legacyHeaders: false
});

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: { error: 'Too many requests, please try again later' }
});

app.use('/api/login', authLimiter);
app.use('/api/', generalLimiter);

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} - ${req.method} ${req.path} - IP: ${req.ip}`);
    next();
});

// In-memory stores (replace with database in production)
const users = [
    { 
        id: 1,
        email: 'farmer@example.com', 
        password: bcrypt.hashSync('password123', 10), 
        name: 'John Farmer',
        role: 'farmer',
        createdAt: new Date().toISOString()
    },
    { 
        id: 2,
        email: 'admin@agripredict.com', 
        password: bcrypt.hashSync('admin123', 10), 
        name: 'Admin User',
        role: 'admin',
        createdAt: new Date().toISOString()
    }
];

const notifications = [
    { 
        id: 1,
        message: 'Heavy rainfall expected next week - consider drainage', 
        time: '2 hours ago',
        type: 'weather',
        priority: 'high',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    { 
        id: 2,
        message: 'Fall armyworm alert in your region', 
        time: '1 day ago',
        type: 'pest',
        priority: 'critical',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    { 
        id: 3,
        message: 'Optimal harvest time approaching', 
        time: '3 days ago',
        type: 'harvest',
        priority: 'medium',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
];

// Validation middleware
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array()
        });
    }
    next();
};

// Enhanced Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(401).json({ 
            error: 'Access token required',
            message: 'Please provide Authorization header with Bearer token'
        });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ 
            error: 'Invalid token format',
            message: 'Use format: Authorization: Bearer <token>'
        });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    error: 'Token expired',
                    message: 'Please login again'
                });
            }
            return res.status(403).json({ 
                error: 'Invalid token',
                message: 'Token verification failed'
            });
        }
        req.user = decoded;
        next();
    });
};

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0',
        environment: NODE_ENV
    });
});

// --- Auth Routes ---
app.post('/api/login', [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    handleValidationErrors
], async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log(`Login attempt for: ${email}`);
        
        const user = users.find(u => u.email === email);
        if (!user) {
            console.log(`User not found: ${email}`);
            return res.status(401).json({ 
                error: 'Invalid credentials',
                message: 'Email or password is incorrect'
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            console.log(`Invalid password for: ${email}`);
            return res.status(401).json({ 
                error: 'Invalid credentials',
                message: 'Email or password is incorrect'
            });
        }

        const token = jwt.sign(
            { 
                id: user.id,
                email: user.email, 
                name: user.name,
                role: user.role
            }, 
            JWT_SECRET, 
            { expiresIn: '24h' }
        );

        console.log(`Login successful for: ${email}`);
        
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            expiresIn: '24h'
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            error: 'Login failed',
            message: 'Internal server error'
        });
    }
});

app.post('/api/logout', authenticateToken, (req, res) => {
    // In a real app, you'd blacklist the token or use Redis
    console.log(`User logged out: ${req.user.email}`);
    res.json({ 
        success: true,
        message: 'Logged out successfully' 
    });
});

app.post('/api/reset-password', [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    handleValidationErrors
], (req, res) => {
    const { email } = req.body;
    console.log(`Password reset requested for: ${email}`);
    
    // In production: generate reset token, send email, store in DB
    res.json({ 
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
        // Don't reveal if email exists for security
    });
});

// --- Weather API ---
app.get('/api/weather', [
    query('location').notEmpty().withMessage('Location parameter required'),
    handleValidationErrors
], (req, res) => {
    const { location } = req.query;
    
    console.log(`Weather requested for: ${location}`);
    
    // Enhanced weather data with more realistic variations
    const weatherData = {
        'Central Kenya': {
            location: { name: 'Central Kenya', country: 'Kenya', region: 'Central' },
            current: {
                temperature: 26 + Math.floor(Math.random() * 4 - 2),
                humidity: 68 + Math.floor(Math.random() * 10 - 5),
                wind_speed: 12 + Math.floor(Math.random() * 6 - 3),
                precip: 15 + Math.floor(Math.random() * 10 - 5),
                weather_descriptions: ['Partly Cloudy'],
                observation_time: new Date().toISOString()
            }
        },
        'Western Kenya': {
            location: { name: 'Western Kenya', country: 'Kenya', region: 'Western' },
            current: {
                temperature: 24 + Math.floor(Math.random() * 4 - 2),
                humidity: 80 + Math.floor(Math.random() * 8 - 4),
                wind_speed: 10 + Math.floor(Math.random() * 4 - 2),
                precip: 22 + Math.floor(Math.random() * 8 - 4),
                weather_descriptions: ['Humid'],
                observation_time: new Date().toISOString()
            }
        },
        'Eastern Kenya': {
            location: { name: 'Eastern Kenya', country: 'Kenya', region: 'Eastern' },
            current: {
                temperature: 29 + Math.floor(Math.random() * 4 - 2),
                humidity: 60 + Math.floor(Math.random() * 10 - 5),
                wind_speed: 14 + Math.floor(Math.random() * 6 - 3),
                precip: 10 + Math.floor(Math.random() * 8 - 4),
                weather_descriptions: ['Sunny'],
                observation_time: new Date().toISOString()
            }
        },
        'Rift Valley': {
            location: { name: 'Rift Valley', country: 'Kenya', region: 'Rift Valley' },
            current: {
                temperature: 22 + Math.floor(Math.random() * 4 - 2),
                humidity: 70 + Math.floor(Math.random() * 8 - 4),
                wind_speed: 8 + Math.floor(Math.random() * 4 - 2),
                precip: 18 + Math.floor(Math.random() * 6 - 3),
                weather_descriptions: ['Cool'],
                observation_time: new Date().toISOString()
            }
        },
        'Coast Province': {
            location: { name: 'Coast Province', country: 'Kenya', region: 'Coast' },
            current: {
                temperature: 30 + Math.floor(Math.random() * 4 - 2),
                humidity: 75 + Math.floor(Math.random() * 10 - 5),
                wind_speed: 16 + Math.floor(Math.random() * 6 - 3),
                precip: 25 + Math.floor(Math.random() * 10 - 5),
                weather_descriptions: ['Hot & Humid'],
                observation_time: new Date().toISOString()
            }
        }
    };

    const result = weatherData[location] || weatherData['Central Kenya'];
    result.timestamp = new Date().toISOString();
    
    res.json(result);
});

// --- Prediction API ---
app.post('/api/predict', [
    authenticateToken,
    body('crop').notEmpty().withMessage('Crop selection required'),
    body('region').notEmpty().withMessage('Region selection required'),
    handleValidationErrors
], (req, res) => {
    const { crop, region } = req.body;
    
    console.log(`Prediction requested - Crop: ${crop}, Region: ${region}, User: ${req.user.email}`);
    
    // Enhanced prediction with crop-specific data
    const cropMultipliers = {
        'Maize': { base: 3.2, variance: 0.8 },
        'Beans': { base: 1.8, variance: 0.4 },
        'Coffee': { base: 2.1, variance: 0.6 },
        'Tea': { base: 2.8, variance: 0.5 },
        'Wheat': { base: 2.5, variance: 0.7 },
        'Rice': { base: 4.2, variance: 1.0 },
        'Sorghum': { base: 2.0, variance: 0.5 }
    };

    const cropData = cropMultipliers[crop] || cropMultipliers['Maize'];
    const yieldEstimate = (cropData.base + (Math.random() - 0.5) * cropData.variance).toFixed(1);
    const confidence = Math.floor(Math.random() * 15 + 85); // 85-100%

    const prediction = {
        success: true,
        crop,
        region,
        yieldEstimate: parseFloat(yieldEstimate),
        confidence,
        factors: [
            { 
                name: 'Weather Conditions', 
                impact: 'Positive', 
                score: Math.floor(Math.random() * 15 + 80),
                description: 'Favorable temperature and rainfall patterns'
            },
            { 
                name: 'Soil Quality', 
                impact: 'Good', 
                score: Math.floor(Math.random() * 20 + 70),
                description: 'Adequate nutrient levels and pH balance'
            },
            { 
                name: 'Pest Risk', 
                impact: 'Low', 
                score: Math.floor(Math.random() * 10 + 85),
                description: 'Minimal pest pressure expected'
            },
            { 
                name: 'Market Conditions', 
                impact: 'Favorable', 
                score: Math.floor(Math.random() * 12 + 82),
                description: 'Strong demand and stable prices'
            }
        ],
        recommendations: [
            `Apply nitrogen fertilizer in 2 weeks for optimal ${crop.toLowerCase()} growth`,
            'Monitor for pest activity during flowering stage',
            'Ensure adequate irrigation during grain filling period',
            'Consider early harvest if weather conditions deteriorate',
            `Market prices for ${crop.toLowerCase()} are expected to remain stable`
        ],
        generatedAt: new Date().toISOString(),
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Valid for 7 days
    };

    res.json(prediction);
});

// --- Enhanced Chatbot API ---
app.post('/api/chat', [
    authenticateToken,
    body('message').isLength({ min: 1, max: 500 }).withMessage('Message must be 1-500 characters'),
    handleValidationErrors
], (req, res) => {
    const { message } = req.body;
    const lower = message.toLowerCase();
    
    console.log(`Chat message from ${req.user.email}: ${message.substring(0, 50)}...`);

    // Enhanced chatbot responses with context
    let response = "I'm here to help with your farming questions. Could you be more specific about what you'd like to know?";
    let category = 'general';

    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        response = `Hello ${req.user.name}! I'm AgriBot, your AI farming assistant. How can I help you today?`;
        category = 'greeting';
    } else if (lower.includes('weather') || lower.includes('rain') || lower.includes('temperature')) {
        response = "Based on current weather patterns, conditions look favorable for the next week. I recommend monitoring soil moisture levels and checking for any pest activity after rainfall.";
        category = 'weather';
    } else if (lower.includes('maize') || lower.includes('corn')) {
        response = "For maize cultivation: ensure 75cm spacing between rows and 25cm between plants. Apply DAP fertilizer at planting (50kg/acre) and top-dress with CAN after 6 weeks. Watch for fall armyworm during early growth stages.";
        category = 'crops';
    } else if (lower.includes('beans')) {
        response = "Beans require well-drained soil and moderate watering. Plant at 30cm x 10cm spacing. Avoid waterlogging which causes root rot. Apply rhizobia inoculant for better nitrogen fixation.";
        category = 'crops';
    } else if (lower.includes('coffee')) {
        response = "Coffee plants need partial shade and consistent moisture. Prune regularly to maintain 2-3 main stems. Watch for coffee berry disease and leaf rust. Harvest when berries are deep red.";
        category = 'crops';
    } else if (lower.includes('pest') || lower.includes('insect') || lower.includes('disease')) {
        response = "For effective pest management: 1) Regular field monitoring (2x weekly), 2) Use integrated pest management (IPM), 3) Encourage beneficial insects, 4) Apply targeted treatments only when necessary. What specific pest are you dealing with?";
        category = 'pest';
    } else if (lower.includes('fertilizer') || lower.includes('nutrient')) {
        response = "Soil testing is key for proper fertilization. Generally: Apply organic matter annually, use DAP/NPK at planting, and top-dress with nitrogen during active growth. Avoid over-fertilization which can reduce quality.";
        category = 'fertilizer';
    } else if (lower.includes('harvest') || lower.includes('when to harvest')) {
        response = "Harvest timing depends on your crop and intended use. Look for visual cues like color change, moisture content, and field drying. Early morning harvesting often gives better quality. What crop are you planning to harvest?";
        category = 'harvest';
    }

    res.json({
        success: true,
        response,
        category,
        timestamp: new Date().toISOString(),
        user: req.user.name
    });
});

// --- Notifications API ---
app.get('/api/notifications', authenticateToken, (req, res) => {
    console.log(`Notifications requested by: ${req.user.email}`);
    
    res.json({
        success: true,
        notifications: notifications.map(notif => ({
            ...notif,
            isRead: false // In production, track read status per user
        })),
        count: notifications.length,
        timestamp: new Date().toISOString()
    });
});

// --- Yield History API ---
app.get('/api/yield-history', authenticateToken, (req, res) => {
    const { crop, years } = req.query;
    
    console.log(`Yield history requested by: ${req.user.email}`);
    
    const yieldData = [
        { year: '2020', predicted: 2.1, actual: 1.9, crop: 'Maize', accuracy: 90.5 },
        { year: '2021', predicted: 2.3, actual: 2.5, crop: 'Maize', accuracy: 91.3 },
        { year: '2022', predicted: 2.8, actual: 2.6, crop: 'Maize', accuracy: 92.9 },
        { year: '2023', predicted: 3.1, actual: 3.2, crop: 'Maize', accuracy: 96.9 },
        { year: '2024', predicted: 3.4, actual: 3.3, crop: 'Maize', accuracy: 97.1 }
    ];

    res.json({
        success: true,
        data: yieldData,
        averageAccuracy: 93.7,
        totalYears: yieldData.length,
        timestamp: new Date().toISOString()
    });
});

// --- Weather History API ---
app.get('/api/weather-history', authenticateToken, (req, res) => {
    const { region, year } = req.query;
    
    console.log(`Weather history requested by: ${req.user.email}`);
    
    const weatherHistory = [
        { month: 'Jan', rainfall: 45, temperature: 28, humidity: 65 },
        { month: 'Feb', rainfall: 52, temperature: 30, humidity: 68 },
        { month: 'Mar', rainfall: 78, temperature: 29, humidity: 72 },
        { month: 'Apr', rainfall: 125, temperature: 27, humidity: 75 },
        { month: 'May', rainfall: 89, temperature: 25, humidity: 78 },
        { month: 'Jun', rainfall: 34, temperature: 23, humidity: 70 },
        { month: 'Jul', rainfall: 28, temperature: 22, humidity: 68 },
        { month: 'Aug', rainfall: 31, temperature: 23, humidity: 69 },
        { month: 'Sep', rainfall: 42, temperature: 25, humidity: 71 },
        { month: 'Oct', rainfall: 67, temperature: 27, humidity: 73 },
        { month: 'Nov', rainfall: 98, temperature: 28, humidity: 76 },
        { month: 'Dec', rainfall: 72, temperature: 29, humidity: 74 }
    ];

    res.json({
        success: true,
        data: weatherHistory,
        region: region || 'Central Kenya',
        year: year || new Date().getFullYear(),
        totalRainfall: weatherHistory.reduce((sum, month) => sum + month.rainfall, 0),
        averageTemperature: Math.round(weatherHistory.reduce((sum, month) => sum + month.temperature, 0) / 12),
        timestamp: new Date().toISOString()
    });
});

// --- User Profile API ---
app.get('/api/profile', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.json({
        success: true,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        }
    });
});

// --- 404 Handler ---
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        message: `${req.method} ${req.originalUrl} is not a valid endpoint`,
        availableEndpoints: [
            'GET /health',
            'POST /api/login',
            'POST /api/logout',
            'POST /api/reset-password',
            'GET /api/weather?location=<location>',
            'POST /api/predict',
            'POST /api/chat',
            'GET /api/notifications',
            'GET /api/yield-history',
            'GET /api/weather-history',
            'GET /api/profile'
        ],
        timestamp: new Date().toISOString()
    });
});

// --- Global Error Handler ---
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    
    res.status(500).json({
        error: 'Internal server error',
        message: NODE_ENV === 'development' ? error.message : 'Something went wrong',
        timestamp: new Date().toISOString()
    });
});

// --- Graceful Shutdown ---
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});

// --- Start Server ---
const server = app.listen(PORT, () => {
    console.log(`AgriPredict AI backend running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Login endpoint: POST http://localhost:${PORT}/api/login`);
    console.log(`API Documentation available at endpoints`);
    console.log(`Environment: ${NODE_ENV}`);
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
    } else {
        console.error('Server error:', error);
    }
    process.exit(1);
});

module.exports = app;
