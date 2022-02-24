'use strict';

const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3002;
const cors = require('cors');
app.use(cors());
const axios = require('axios');
//let data = require('./data/weather.json');

app.get('/', (request, response) => {
  response.send('Test GET, please ignore');
});

app.get('/weather', async (request, response) => {
  let lat = request.query.lat;
  let lon = request.query.lon;
  let wxURL = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&units=I&days=3&lat=${lat}&lon=${lon}`;

  try{
    let wxData = await axios.get(wxURL);
    let wxObject = wxData.data.data;

    let requestedWx = [];
    for(let i = 0; i < wxObject.length; i++){
      requestedWx.push(new Forecast(wxObject[i]));
    }
    response.send(requestedWx);
  }
  catch(error) {
    response.status(500).send(error.message);
  }
});

app.get('/movies', async (request, response) => {
  let location=request.query.location;
  let moviesURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${location}`;

  try{
    let movieData = await axios.get(moviesURL);

    let fullData = [];
    for(let i = 1; i <= movieData.data.total_pages; i++){
      let currentPage = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${location}&page=${i}`);
      currentPage.data.results.forEach((result) => fullData.push(result));
    }
    fullData.sort((a, b) => b.popularity - a.popularity);

    let sortedMovies = new Movie(fullData);

    response.send(sortedMovies);
  }
  catch (error){
    response.status(500).send(error.message);
  }

});

class Forecast {
  constructor(wxData) {
    this.description = `Low of ${wxData.low_temp}, high of ${wxData.high_temp} with ${wxData.weather.description.toLowerCase()}`;
    this.date = `${wxData.datetime}`;
  }
}

class Movie {
  constructor(movieData) {
    this.movies = movieData.slice(0, 20);
  }
}

app.use( (error, request, response, next) => {
  console.log(error);
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
