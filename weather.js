'use strict';

const axios = require('axios');

async function getWeather(request, response) {
  let lat = request.query.lat;
  let lon = request.query.lon;
  let wxURL = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&units=I&days=3&lat=${lat}&lon=${lon}`;

  try {
    let wxData = await axios.get(wxURL);
    let wxObject = wxData.data.data;

    let requestedWx = [];
    for (let i = 0; i < wxObject.length; i++) {
      requestedWx.push(new Forecast(wxObject[i]));
    }
    response.send(requestedWx);
  }
  catch (error) {
    response.status(500).send(error.message);
  }
}

class Forecast {
  constructor(wxData) {
    this.description = `Low of ${wxData.low_temp}, high of ${wxData.high_temp} with ${wxData.weather.description.toLowerCase()}`;
    this.date = `${wxData.datetime}`;
  }
}

module.exports = getWeather;
