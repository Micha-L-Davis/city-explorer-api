'use strict';

require('dotenv').config();
let axios = require('axios');
let cache = require('./cache.js');

function getMovies(request, response) {
  const key = 'movies-' + request.query.location;
  let location = request.query.location;
  let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${location}`;

  if (cache[key] && (Date.now() - cache[key].timestamp < 1000 * 60 * 60 * 24 * 7 * 26)) {
    console.log('Cache hit');
    response.send(cache[key].data);
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    axios.get(url)
      .then(response => {
        let fullData = [];
        if (response.data.total_pages > 1) {
          fullData = getAllPages(url, response.data.total_pages);
        } else {
          fullData = response.data;
        }
        return fullData;
      })
      .then(fullData => fullData.sort((a, b) => b.popularity - a.popularity))
      .then(sortedData => new Movie(sortedData))
      .then(movies => {
        cache[key].data = movies;
        response.send(movies);
      })
      .catch(error => response.send(error.message));
  }
}

async function getAllPages(url, pages) {
  let fullData = [];
  while (pages > 0) {
    let currentPage = await axios.get(`${url}&page=${pages}`);
    currentPage.data.results.forEach((result) => fullData.push(result));
    pages--;
  }
  return fullData;
}

class Movie {
  constructor(movieData) {
    this.movies = movieData.slice(0, 20);
  }
}

module.exports = getMovies;
