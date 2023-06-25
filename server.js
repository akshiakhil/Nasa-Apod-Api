const express = require('express');
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;
const API_KEY = 'hGqArteNouwBZwQS4GrSBwoa1CjKdUybNnyNPwiQ';

// Set static folder
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.urlencoded({ extended: true }));

// Route to fetch APOD data
app.get('/apod', (req, res) => {
  const { date } = req.query;
  const apiUrl = date
    ? `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`
    : `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

  axios
    .get(apiUrl)
    .then((response) => {
      const apodData = response.data;
      const apiLimit = response.headers['x-ratelimit-remaining'];

      // Add the API limit to the APOD data object
      apodData.apiLimit = apiLimit;

      res.json(apodData);
    })
    .catch((error) => {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'An error occurred' });
    });
});

// Serve the index page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Serve the Nasa-Apod page
app.get('/Nasa-Apod', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'Nasa-Apod.html'));
});

// Serve the Nasa-Apod-Date page
app.get('/Nasa-Apod-Date', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'Nasa-Apod-Date.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
