'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weather = require('./modules/weather.js');
const movies = require('./modules/movies.js');
const app = express();
app.use(cors());

app.get('/weather', weatherHandler);

function weatherHandler(request, response) {
  const { lat, lon } = request.query;
  weather(lat, lon)
    .then(summaries => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(500).send('Weather data unavailable!');
    });
}

app.get('/movies', movies);

// function moviesHandler(request, response) {
//   movies(request.query)
//     .then(summaries => response.send(summaries))
//     .catch(error => {
//       console.error(error);
//       response.status(500).send('Movie data unavailable!');
//     });
// }

app.listen(process.env.PORT, () => console.log(`Server up on ${process.env.PORT}`));
