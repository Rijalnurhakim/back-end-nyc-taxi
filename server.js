const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;
const API_URL = 'https://data.cityofnewyork.us/resource/gkne-dk5s.json';

// Endpoint untuk mengambil data dengan filter
app.get('/api/trips', async (req, res) => {
    try {
        const { fare_min, fare_max, distance_min, distance_max, time } = req.query;
        
        let whereClauses = [];
        if (fare_min && fare_max) whereClauses.push(`fare_amount between ${fare_min} and ${fare_max}`);
        if (distance_min && distance_max) whereClauses.push(`trip_distance between ${distance_min} and ${distance_max}`);
        if (time) whereClauses.push(`tpep_pickup_datetime >= '${time}'`);

        let whereQuery = whereClauses.length ? `$where=${whereClauses.join(" AND ")}&` : '';

        const url = `${API_URL}?${whereQuery}$limit=100`;
        
        console.log(`Fetching: ${url}`); // Debugging URL

        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Export app untuk digunakan di Vercel
module.exports = app;
