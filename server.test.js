const request = require('supertest');
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

const API_URL = 'https://data.cityofnewyork.us/resource/gkne-dk5s.json';

app.get('/api/trips', async (req, res) => {
    try {
        const response = await axios.get(API_URL);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

test('GET /api/trips should return data', async () => {
    const response = await request(app).get('/api/trips');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
});
