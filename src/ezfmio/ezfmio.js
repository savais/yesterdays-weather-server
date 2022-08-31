import fetch from 'node-fetch';
import xml2js from 'xml2js';

// fmi open data urls
const simpleCityQueryString = (x) => "https://opendata.fmi.fi/wfs?request=getFeature&storedquery_id=fmi::observations::weather::daily::simple&place="+x;
const simpleTimeRangeCityQueryString = (x, tstart, tstop) => "https://opendata.fmi.fi/wfs?request=getFeature&storedquery_id=fmi::observations::weather::daily::simple&place="+x+"&starttime="+tstart+"&endtime="+tstop;
const obsTVPair = (x, tstart, tstop) => "https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::observations::weather::TimeValuePair&Timestep=60&place="+x+"&starttime="+tstart+"&endtime="+tstop;
const forecastTVPair = (x, tstart, tstop) => "https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::forecast::harmonie::surface::point::timevaluepair&Timestep=60&place="+x+"&starttime="+tstart+"&endtime="+tstop;


// Regex
const reOmResult = /(?:<om:result>)[\s\S]*?(?:<\/om:result>)/g;
const reNaN = /NaN/;
const reWml2Measurement = /(?<=<wml2:MeasurementTVP>)[\s\S]*?(?=<\/wml2:MeasurementTVP>)/g;
const reWml2Value = /(?<=<wml2:value>)[\s\S]*?(?=<\/wml2:value>)/;
const reWml2Time = /(?<=<wml2:time>)[\s\S]*?(?=<\/wml2:time>)/;
const reGmlId = /(?<=gml\:id=").*?(?=")/;

const idTable = {
    "obs-obs-1-1-t2m": "tempC",
    "obs-obs-1-1-ws_10min": "windSpeed",
    "obs-obs-1-1-wd_10min": "windDirection",
    "obs-obs-1-1-rh": "relativeHumidity",
    "obs-obs-1-1-td": "tempCDewPoint",
    "obs-obs-1-1-r_1h": "rain_1h",
    "obs-obs-1-1-n_man": "cloudCoverage",
    "obs-obs-1-1-wawa": "wawa",
    "obs-obs-1-1-vis": "visibility",
    "obs-obs-1-1-p_sea": "airPressureSea",
    "obs-obs-1-1-snow_aws": "snow",
    "obs-obs-1-1-ri_10min": "ri_10min",
    "obs-obs-1-1-wg_10min": "windGust",
    "mts-1-1-Pressure": "airPressureSea",
    "mts-1-1-GeopHeight": "geopHeight",
    "mts-1-1-Temperature": "tempC",
    "mts-1-1-DewPoint": "tempCDewPoint",
    "mts-1-1-Humidity": "relativeHumidity",
    "mts-1-1-WindDirection" : "windDirection",
    "mts-1-1-WindSpeedMS": "windSpeed",
    "mts-1-1-WindUMS": "windUMS",
    "mts-1-1-WindVMS": "windVMS",
    "mts-1-1-PrecipitationAmount": "rain_1h",
    "mts-1-1-TotalCloudCover": "totalCloudCover",
    "mts-1-1-HighCloudCover": "highCloudCover",
    "mts-1-1-MediumCloudCover": "mediumCloudCover",
    "mts-1-1-LowCloudCover": "lowCloudCover",
    "mts-1-1-RadiationGlobal": "radiationGlobal",
    "mts-1-1-RadiationGlobalAccumulation": "radiationGlobalAccumulation",
    "mts-1-1-RadiationNetSurfaceLWAccumulation" : "radiationNetSurfaceLWAccumulation",
    "mts-1-1-RadiationNetSurfaceSWAccumulation" : "radiationNetSurfaceSWAccumulation",
    "mts-1-1-RadiationSWAccumulation" : "radiationSWAccumulation",
    "mts-1-1-Visibility" : "visibility",
    "mts-1-1-WindGust" : "windGust"
}



/**
 * GetObservation
 *  returns eventDates observation data for the closest weather station
 * @param {string} city 
 * @param {date} eventDate
 * @returns {object} results
 */
const GetObservation = async (city, eventDate) => {
    eventDate.zeroHours();
    let targetUrl = obsTVPair(city, eventDate.toISOString(), eventDate.addHours(23).toISOString());

    // console.log(eventDate + " - " + targetUrl);

    const response = await fetch(targetUrl);
    const body = await response.text();

    let results = {};
    let omResults

    // capture only om:results
    do
    {
        // console.log("enter do-while ")
        omResults = reOmResult.exec(body)
        if(omResults != null){

            
            // if results contains a NaN, skip. It's most likely a feature set that is not available at that observation location.
            if(!reNaN.test(omResults))
            {
                // console.log("enter if - " + reGmlId.exec(omResults))
                results[idTable[reGmlId.exec(omResults)]] = new String(omResults).match(reWml2Measurement).map(x => {
                    return {"time":new Date(x.match(reWml2Time)), "value": Number(x.match(reWml2Value)) }
                });
            }
        }


    } while (omResults)

    // console.log(JSON.stringify(results))
    return results
}

/**
 * GetForecast
 *  returns eventDates forecast data for the city
 * @param {string} city 
 * @param {date} eventDate
 * @returns {object} Results
 */
const GetForecast = async (city, eventDate) => {
    eventDate.zeroHours();
    let targetUrl = forecastTVPair(city, eventDate.toISOString(), eventDate.addHours(23).toISOString());

    // console.log(eventDate + " - " + targetUrl);

    const response = await fetch(targetUrl);
    const body = await response.text();

    let results = {};
    let omResults

    // capture only om:results
    do
    {
        // console.log("enter do-while")
        omResults = reOmResult.exec(body)
        if(omResults != null){

            
            // Filter NaN's out of the final results
            results[idTable[reGmlId.exec(omResults)]] = new String(omResults).match(reWml2Measurement).filter(n => !reNaN.test(n)).map(x => {
                return {"time":new Date(x.match(reWml2Time)), "value": Number(x.match(reWml2Value)) }
            });
        }


    } while (omResults)

    return results
}

/**
 * GetForecastAll
 * @param {}
 * @returns json : returns forecast data for the city / weather station
 */
 const GetForecastAll = async (eventDate, cities) => {
    eventDate.zeroHours();
    let results = {};

    await sleep(500);

    for(let i = 0; i < cities.length; i++) {
        await sleep(2000);
        console.log("Updating forecast data for: " + cities[i]);
        results[cities[i]] = await GetForecast(cities[i], eventDate);
    }

    return results
}

/**
 * GetObservationAll
 * @param {}
 * @returns json : returns observation data for the city / weather station
 */
 const GetObservationAll = async (eventDate, cities) => {
    eventDate.zeroHours();
    let results = {};

    await sleep(500);

    for(let i = 0; i < cities.length; i++) {
        await sleep(2000);
        console.log("Updating observation data for: " + cities[i]);
        results[cities[i]] = await GetObservation(cities[i], eventDate);
    }

    return results
}






/**
 * GetCityToday
 * @params string : name of the city
 * @returns json : simple weather data for the city
 */
const GetCityToday = async (city, options) => {
    const response = await fetch(simpleCityQueryString(city));
    const body = await response.text();


    let arr = [];

    var parser = new xml2js.Parser()
    try {
        const result = await parser.parseStringPromise(body)
        result["wfs:FeatureCollection"]["wfs:member"].forEach(element => {
            if(element["BsWfs:BsWfsElement"][0]["BsWfs:ParameterValue"][0] != "NaN")
                arr.push({"timestamp": element["BsWfs:BsWfsElement"][0]["BsWfs:Time"][0], "parameter":element["BsWfs:BsWfsElement"][0]["BsWfs:ParameterName"][0], "value":element["BsWfs:BsWfsElement"][0]["BsWfs:ParameterValue"][0]})
        });
        return arr;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

/**
 * GetCityYesterday
 * @params string : name of the city
 * @returns json : yesterdays simple weather data for the city
 */
const GetCityYesterday = async (city, options) => {

    const response = await fetch(simpleTimeRangeCityQueryString(city, yesterday(), today()));
    const body = await response.text();

    // console.log(simpleTimeRangeCityQueryString(city, yesterday(), today()));

    let arr = [];

    var parser = new xml2js.Parser()
    try {
        const result = await parser.parseStringPromise(body)
        result["wfs:FeatureCollection"]["wfs:member"].forEach(element => {
            if(element["BsWfs:BsWfsElement"][0]["BsWfs:ParameterValue"][0] != "NaN")
                arr.push({"timestamp": element["BsWfs:BsWfsElement"][0]["BsWfs:Time"][0], "parameter":element["BsWfs:BsWfsElement"][0]["BsWfs:ParameterName"][0], "value":element["BsWfs:BsWfsElement"][0]["BsWfs:ParameterValue"][0]})
        });
        return arr;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

/**
 * GetCityDaybefore
 * @params string : name of the city
 * @returns json : The day before yesterdays simple weather data for the city
 */
const GetCityDayBefore = async (city, options) => {

    const response = await fetch(simpleTimeRangeCityQueryString(city, daybefore(), yesterday()));
    const body = await response.text();

    // console.log(simpleTimeRangeCityQueryString(city, yesterday(), today()));

    let arr = [];

    var parser = new xml2js.Parser()
    try {
        const result = await parser.parseStringPromise(body)
        result["wfs:FeatureCollection"]["wfs:member"].forEach(element => {
            if(element["BsWfs:BsWfsElement"][0]["BsWfs:ParameterValue"][0] != "NaN")
                arr.push({"timestamp": element["BsWfs:BsWfsElement"][0]["BsWfs:Time"][0], "parameter":element["BsWfs:BsWfsElement"][0]["BsWfs:ParameterName"][0], "value":element["BsWfs:BsWfsElement"][0]["BsWfs:ParameterValue"][0]})
        });
        return arr;
    } catch (err) {
        console.log(err);
        throw err;
    }
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

const today = () => {
    let d = zeroDate(new Date())

    return d.toISOString();
}

const yesterday = () => {
    let d = zeroDate(new Date())

    d.addHours(-24)
    return d.toISOString();
}

const daybefore = () => {
    let d = zeroDate(new Date())

    d.addHours(-48)
    return d.toISOString();
}

const tomorrow = () => {
    let d = zeroDate(new Date())

    d.addHours(24)
    return d.toISOString();
}

const zeroDate = (d) => {
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);

    return d;
}

let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export {GetObservation, GetObservationAll, GetForecast, GetForecastAll, GetCityToday, GetCityYesterday, GetCityDayBefore};



/*
FMI Open data WMS services request limitations:

Download Service has limit of 20000 requests per day
View Service has limit of 10000 requests per day
Download and View Services have combined limit of 600 requests per 5 minutes
*/