import {GetObservation, GetForecast, GetForecastAll, GetObservationAll} from "./ezfmio/ezfmio.js";
import {storage} from "./storage.js"

import express from "express"

const app = express()
const port = 3000

const data = storage()


app.get('/', (req, res) => {
  res.send('Hello World!')
})

/**
 * endpoint /city
 * @params string : name of the city
 * @returns json : returns todays forecast and observations for yesterday and the day before.
 */
app.get('/city', (req, res) => {
  const city = req.query.city;

  if(city == null) {
    res.sendStatus(400);
    return;
  } 

  let result = data.today.get(city);

  if(result == undefined){ 
    console.log(-1)

    GetCity(city).then(arr => {
      data.today.add(city, arr);

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(arr));
      // console.log(arr);
      
    }).catch(err => {
      console.log("error: " + err);
      res.sendStatus(500);
    });
  } else {
    console.log("else")
    res.setHeader('Content-Type', 'application/json');
    res.send(result)
  }
  })

/**
 * endpoint /city/today
 * @params string : name of the city
 * @returns json : weather data for today
 */
app.get('/city/today', (req, res) => {
  const city = req.query.city.toLowerCase();

  if(city == null) {
    res.sendStatus(400);
    return;
  } 

  let result = data.today.get(city);

  if(result == undefined){ 
    // console.log(-1)

    GetForecast(city, new Date()).then(arr => {
      data.today.add(city, arr);

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(arr));
      // console.log(arr);
      
    }).catch(err => {
      console.log("error: " + err);
      res.sendStatus(500);
    });
  } else {
    // console.log("else")
    res.setHeader('Content-Type', 'application/json');
    res.send(result)
  }
  })
  
  /**
   * endpoint /city/yesterday
   * @params string : name of the city
   * @returns json : weather data for yesterday
   */
app.get('/city/yesterday', (req, res) => {
  const city = req.query.city.toLowerCase();

  if(city == null) {
    res.sendStatus(400);
    return;
  } 

  let result = data.yesterday.get(city);

  if(result == undefined){ 
    // console.log(-1)

    GetObservation(city, new Date().addHours(-24)).then(arr => {
      data.yesterday.add(city, arr);

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(arr));
      // console.log(arr);
      
    }).catch(err => {
      console.log("error: " + err);
      res.sendStatus(500);
    });
  } else {
    // console.log("else")
    res.setHeader('Content-Type', 'application/json');
    res.send(result)
  }
  })

  /**
   * endpoint /city/daybefore
   * @param {string} city
   * @returns {json} weather data for the day before
   */
app.get('/city/daybefore', (req, res) => {
  const city = req.query.city.toLowerCase();

  if(city == null) {
    res.sendStatus(400);
    return;
  } 

  let result = data.daybefore.get(city);

  if(result == undefined){ 
    // console.log(-1)

    GetObservation(city, new Date().addHours(-48)).then(arr => {
      data.daybefore.add(city, arr);

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(arr));
      // console.log(arr);
      
    }).catch(err => {
      console.log("error: " + err);
      res.sendStatus(500);
    });
  } else {
    // console.log("else")
    res.setHeader('Content-Type', 'application/json');
    res.send(result)
  }
  })


app.listen(port, async () => {
  console.log(`Weather api listening on port ${port}`)
  let eventDate;

  while(true) {
    UpdateEverything();
    eventDate = new Date().zeroHours().addHours(25);
    console.log("Forecast update scheduled for " + eventDate)
    await sleepUntil(eventDate)
  }
})


/**
 * UpdateEverything
 * @param {none}
 * @returns 
 */
const UpdateEverything = () => {
  console.log('Beginning to UpdateEverything()')

  data.rollForwards();
  let cities = data.getCities()

  if(cities.length < 5) {
    console.log("Citylist too short - Using top100 list instead.")
    cities = top100cities;
  } else {
    console.log(cities + " " + cities.length)
  }

  GetForecastAll(new Date(), cities).then(results => {
    for (const [key, value] of Object.entries(results)) {
      if(data.today.get(key) === undefined) {
        data.today.add(key, value)
      } else {
        data.today.update(key, value)
      }
    }
  });

  GetObservationAll(new Date().addHours(-24), cities).then(results => {
    for (const [key, value] of Object.entries(results)) {
      if(data.yesterday.get(key) === undefined) {
        data.yesterday.add(key, value)
      } else {
        data.yesterday.update(key, value)
      }
    }
  });

  
}



// Helpers
Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h*60*60*1000));
  return this;
}

Date.prototype.zeroHours = function() {
  this.setHours(0);
  this.setMinutes(0);
  this.setSeconds(0);
  this.setMilliseconds(0);

  return this;
}

let sleepUntil = eventDate => new Promise(resolve => {
  let msDiff = eventDate - new Date();
  // console.log(msDiff)
  setTimeout(resolve, msDiff)
});

// top100 by population
const top100cities = ["Helsinki",  "Espoo",  "Tampere",  "Vantaa",  "Oulu",  "Turku",  "Jyväskylä",  "Kuopio",  "Lahti",  "Pori",  "Kouvola",  
    "Joensuu",  "Lappeenranta",  "Hämeenlinna",  "Vaasa",  "Seinäjoki",  "Rovaniemi",  "Mikkeli",  "Salo",  "Porvoo",  "Kotka",  "Kokkola",  
    "Hyvinkää",  "Lohja",  "Järvenpää",  "Nurmijärvi",  "Kirkkonummi",  "Tuusula",  "Rauma",  "Kerava",  "Kajaani",  "Kaarina",  "Nokia",  
    "Ylöjärvi",  "Kangasala",  "Savonlinna",  "Vihti",  "Riihimäki",  "Raasepori",  "Imatra",  "Raisio",  "Raahe",  "Lempäälä",  "Sastamala",  
    "Hollola",  "Sipoo",  "Tornio",  "Siilinjärvi",  "Iisalmi",  "Mäntsälä",  "Valkeakoski",  "Lieto",  "Pirkkala",  "Kurikka",  "Varkaus",  
    "Kemi",  "Jämsä",  "Hamina",  "Mustasaari",  "Naantali",  "Kempele",  "Pietarsaari",  "Laukaa",  "Äänekoski",  "Heinola",  "Pieksämäki",  
    "Forssa",  "Akaa",  "Janakkala",  "Orimattila",  "Loimaa",  "Uusikaupunki",  "Ylivieska",  "Kauhava",  "Kuusamo",  "Parainen",  "Kontiolahti",  
    "Loviisa",  "Lapua",  "Kauhajoki",  "Ulvila",  "Kankaanpää",  "Kalajoki",  "Ilmajoki",  "Liperi",  "Maarianhamina",  "Eura",  "Alavus",  
    "Pedersören kunta",  "Paimio",  "Lieksa",  "Muurame",  "Nivala",  "Sotkamo",  "Kauniainen",  "Hämeenkyrö",  "Liminka",  "Ii",  "Kitee",  "Huittinen" ]