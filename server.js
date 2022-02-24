'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const getWeather = require('./weather.js');
const getMovies = require('./movies.js');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());

app.get('/', (request, response) => {
  response.send('Test GET, please ignore');
});

app.get('/weather', getWeather);

app.get('/movies', getMovies);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
