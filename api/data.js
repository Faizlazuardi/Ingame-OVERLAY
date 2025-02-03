const express = require('express');
const cors = require('cors');
const axios = require('axios');
const csv = require('csv-parser');
const { Readable } = require('stream');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// URL spreadsheet dalam format CSV
const SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1WPZ4gt1uy91khX6W4u1dG1sSdohj4mo1RCx0zoLatq4/export?format=csv&gid=0';

// Endpoint untuk mengambil data dari spreadsheet
app.get('/api/data', async (req, res) => {
    try {
        // Ambil data dari spreadsheet
        const response = await axios.get(SPREADSHEET_URL);
        
        // Konversi CSV ke JSON
        const results = [];
        const stream = Readable.from(response.data);
        
        stream
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                res.json(results);
            });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/api/data`);
});