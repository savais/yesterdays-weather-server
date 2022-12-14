import { GetObservation, GetForecast, GetForecastAll, GetObservationAll } from "./ezfmio/ezfmio.js";
import { storage } from "./storage.js";
import { filterDay } from "./filter.js";

import * as dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT;

const data = storage();

// var corsOptions = {
//   methods: 'GET'
// };


app.use(cors());

app.get('/api/', (req, res) => {
  res.sendStatus(200);
});

/**
 * endpoint /cities
 * @returns {array} : returns all currently known cities.
 */
app.get('/api/cities', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(data.getCities());
});



/**
 * endpoint /city
 * @param {string} city : name of the city
 * @returns {json} : returns todays forecast and observations for yesterday and the day before.
 */
app.get('/api/:city', async (req, res) => {
  const city = req.params.city;

  if(city == null) {
    res.sendStatus(400);
    return;
  } 

  let result = {};

  // Fetch data if not in storage/cache
  if(data.today.get(city) === undefined){
    try {
      let day = await GetForecast(city, new Date());
      if(Object.keys(day).length === 0) {
        res.sendStatus(404);
        return;
      }
      data.today.add(city, day);
    } catch(err) {
      throw err;
    }
  }

  if(data.yesterday.get(city) === undefined){
    try {
      let day = await GetObservation(city, new Date().addHours(-24));
      data.yesterday.add(city, day);
    } catch(err) {
      throw err;
    }
  }

  if(data.daybefore.get(city) === undefined){
    try {
      let day = await GetObservation(city, new Date().addHours(-48));
      data.daybefore.add(city, day);
    } catch(err) {
      throw err;
    }
  }
  
  result.today = filterDay(data.today.get(city));
  result.yesterday = filterDay(data.yesterday.get(city));
  result.daybefore = filterDay(data.daybefore.get(city));

  res.setHeader('Content-Type', 'application/json');
  res.send(result);
  });

/**
 * endpoint /today
 * @param {string} city : name of the city
 * @returns {json} : weather data for today
 */
app.get('/api/:city/today', (req, res) => {
  const city = req.params.city.toLowerCase();

  if(city == null) {
    res.sendStatus(400);
    return;
  } 

  let result = data.today.get(city);

  if(result == undefined){ 

    GetForecast(city, new Date()).then(arr => {
      if(Object.keys(arr).length === 0) {
        res.sendStatus(404);
        return;
      }
      
      data.today.add(city, arr);

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(arr));
      
    }).catch(err => {
      console.log("error: " + err);
      res.sendStatus(500);
    });
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.send(result);
  }
  });
  
  /**
   * endpoint /yesterday
   * @param {string} city : name of the city
   * @returns {json} : weather data for yesterday
   */
app.get('/api/:city/yesterday', (req, res) => {
  const city = req.params.city.toLowerCase();

  if(city == null) {
    res.sendStatus(400);
    return;
  } 

  let result = data.yesterday.get(city);

  if(result == undefined){ 

    GetObservation(city, new Date().addHours(-24)).then(arr => {
      if(Object.keys(arr).length === 0) {
        res.sendStatus(404);
        return;
      }
      data.yesterday.add(city, arr);

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(arr));
      
    }).catch(err => {
      console.log("error: " + err);
      res.sendStatus(500);
    });
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.send(result);
  }
  });

  /**
   * endpoint /daybefore
   * @param {string} city
   * @returns {json} : weather data for the day before
   */
app.get('/api/:city/daybefore', (req, res) => {
  const city = req.params.city.toLowerCase();

  if(city == null) {
    res.sendStatus(400);
    return;
  } 

  let result = data.daybefore.get(city);

  if(result == undefined){ 

    GetObservation(city, new Date().addHours(-48)).then(arr => {
      if(Object.keys(arr).length === 0) {
        res.sendStatus(404);
      }
      data.daybefore.add(city, arr);

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(arr));
      
    }).catch(err => {
      console.log("error: " + err);
      res.sendStatus(500);
    });
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.send(result);
  }
  });


if (process.env.NODE_ENV !== 'test') {
  app.listen(port, async () => {
    console.log(`Weather api listening on port ${port}`);
    let eventDate;

    while(true) {
      UpdateEverything();
      eventDate = new Date().zeroHours().addHours(25);
      console.log("Forecast update scheduled for " + eventDate);
      await sleepUntil(eventDate);
    }
  });
}


/**
 * UpdateEverything
 *  Fetches new forecasts and observations for every stored city
 */
const UpdateEverything = () => {
  console.log('Beginning to UpdateEverything()');

  data.rollForwards();
  let cities = data.getCities();

  // Don't use top100 if running in test or dev enviroment
  if(process.env.NODE_ENV === 'test') {

    console.log("Test enviroment detected, using single city list");
    cities = ['Helsinki'];

  } else {

    if(cities.length < 5 && process.env.NODE_ENV !== 'dev') {
    console.log("Citylist too short - Using top100 list instead.");
    cities = top100cities;
    
    } else {
      cities = ["Helsinki",  "Espoo",  "Tampere",  "Vantaa",  "Oulu",  "Turku",  "Jyv??skyl??",  "Kuopio",  "Lahti",  "Pori"];
    }
  }


  GetForecastAll(new Date(), cities).then(results => {
    for (const [key, value] of Object.entries(results)) {

      if(data.today.get(key) === undefined) {
        data.today.add(key, value);
      } else {
        data.today.update(key, value);
      }
    }

    console.log('Forecast updates done.');
  });

  GetObservationAll(new Date().addHours(-24), cities).then(results => {
    for (const [key, value] of Object.entries(results)) {

      if(data.yesterday.get(key) === undefined) {
        data.yesterday.add(key, value);
      } else {
        data.yesterday.update(key, value);
      }
    }

    console.log('Observation updates done.');
  });
};



// Helpers
Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h*60*60*1000));
  return this;
};

Date.prototype.zeroHours = function() {
  this.setHours(0);
  this.setMinutes(0);
  this.setSeconds(0);
  this.setMilliseconds(0);

  return this;
};

let sleepUntil = eventDate => new Promise(resolve => {
  let msDiff = eventDate - new Date();
  // console.log(msDiff)
  setTimeout(resolve, msDiff);
});

// top100 by population
const top100cities = ["Helsinki",  "Espoo",  "Tampere",  "Vantaa",  "Oulu",  "Turku",  "Jyv??skyl??",  "Kuopio",  "Lahti",  "Pori",  "Kouvola",  
    "Joensuu",  "Lappeenranta",  "H??meenlinna",  "Vaasa",  "Sein??joki",  "Rovaniemi",  "Mikkeli",  "Salo",  "Porvoo",  "Kotka",  "Kokkola",  
    "Hyvink????",  "Lohja",  "J??rvenp????",  "Nurmij??rvi",  "Kirkkonummi",  "Tuusula",  "Rauma",  "Kerava",  "Kajaani",  "Kaarina",  "Nokia",  
    "Yl??j??rvi",  "Kangasala",  "Savonlinna",  "Vihti",  "Riihim??ki",  "Raasepori",  "Imatra",  "Raisio",  "Raahe",  "Lemp????l??",  "Sastamala",  
    "Hollola",  "Sipoo",  "Tornio",  "Siilinj??rvi",  "Iisalmi",  "M??nts??l??",  "Valkeakoski",  "Lieto",  "Pirkkala",  "Kurikka",  "Varkaus",  
    "Kemi",  "J??ms??",  "Hamina",  "Mustasaari",  "Naantali",  "Kempele",  "Pietarsaari",  "Laukaa",  "????nekoski",  "Heinola",  "Pieks??m??ki",  
    "Forssa",  "Akaa",  "Janakkala",  "Orimattila",  "Loimaa",  "Uusikaupunki",  "Ylivieska",  "Kauhava",  "Kuusamo",  "Parainen",  "Kontiolahti",  
    "Loviisa",  "Lapua",  "Kauhajoki",  "Ulvila",  "Kankaanp????",  "Kalajoki",  "Ilmajoki",  "Liperi",  "Maarianhamina",  "Eura",  "Alavus",  
    "Peders??ren kunta",  "Paimio",  "Lieksa",  "Muurame",  "Nivala",  "Sotkamo",  "Kauniainen",  "H??meenkyr??",  "Liminka",  "Ii",  "Kitee",  "Huittinen" ];


export {app};  // TODO: check whether or not this is bad practice / risky