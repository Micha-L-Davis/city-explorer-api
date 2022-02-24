'use strict';

const axios = require('axios');

async function getMovies(request, response) {
  let location = request.query.location;
  let moviesURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${location}`;

  try {
    let movieData = await axios.get(moviesURL);

    let fullData = [];
    for (let i = 1; i <= movieData.data.total_pages; i++) {
      let currentPage = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${location}&page=${i}`);
      currentPage.data.results.forEach((result) => fullData.push(result));
    }
    fullData.sort((a, b) => b.popularity - a.popularity);

    let sortedMovies = new Movie(fullData);

    response.send(sortedMovies);
  }
  catch (error) {
    response.status(500).send(error.message);
  }
}

class Movie {
  constructor(movieData) {
    this.movies = movieData.slice(0, 20);
  }
}

module.exports = getMovies;
