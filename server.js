'use strict';

const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3002;
const cors = require('cors');
app.use(cors());
let data = require('./data/weather.json');

app.get('/', (request, response) => {
  response.send('Test GET, please ignore');
});

app.get('/weather', (request, response) => {
  let city = request.query.city;
  let lat = request.query.lat;
  let lon = request.query.lon;
  try{
    let wxObject = data.find(wx => wx.city_name === city);
    console.log(wxObject);
    let requestedWx = [];
    for(let i = 0; i < wxObject.data.length; i++){
      requestedWx.push(new Forecast(wxObject.data[i]));
    }
    response.send(requestedWx);
  }
  catch(error) {
    response.status(500).send('Weather data unavailable');
  }
});

class Forecast {
  constructor(wxData) {
    this.description = `Low of ${wxData.low_temp}, high of ${wxData.high_temp} with ${wxData.weather.description.toLowerCase()}`;
    this.date = `${wxData.datetime}`;
  }
}

app.use( (error, request, response, next) => {
  console.log(error);
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
