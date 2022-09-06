



const paramList = ['tempC', 'windSpeed', 'windDirection', 'cloudCoverage', 'totalCloudCoverage', 'rain_1h']



const filterDay = (day) => {
    let result = {};

    for (const [key, value] in day) {
        switch (key) {
            
            case 'rain_1h':
                result[key] = filterRain(value);
                break;

            case 'totalCloudCoverage':
                if(!('cloudCoverage' in result)) {
                    result['cloudCoverage'] = filterClouds(value.map(e => {
                        return {...e, 'value': normalizeClouds(e.value)}
                    }))
                }
                break;

            case 'cloudCoverage':
                result[key] = filterClouds(value);
                break;

            case 'windDirection':
                result[key] = filterWindDirection(value);
                break;

            case 'windSpeed':
            case 'tempC':
                result[key] = filterLinearValue(value);
                break;

            default:
                break;
        }

    }

    return result;
}



/**
 * filterLinearValue : for filtering linear values like temperature and windspeed
 * @param {array} arr 
 * @returns {array} array containing min, max, mean
 */
const filterLinearValue = (arr) => {
    let result;

    result = {...getMinMax(arr.map(e => e.value))}
    result['mean'] = getMean(getDaytime(arr, 10, 20).map(e => e.value))

    return result
}

/**
 * filterWindDirection : boils down directional number (0-360) to 0-7 (wind directions: N, NE, E...)
 * @param {array} arr array of datapoints {'time': <dateobject>, 'value': <measurement>}
 * @returns 
 */
const filterWindDirection = (arr) => {

    let daytimeArr = getDaytime(arr, 10, 20)
    arr = daytimeArr.map(e => {return normalizeWindDirection(e.value)})

    return getMode(arr)
}

/**
 * filterRain : takes in a days worth of datapoints in an array, processes them down to few numbers.
 * @param {array} arr array of datapoints {'time': <dateobject>, 'value': <measurement>}
 * @returns {object} with mean, max, total  rain fall
 */
const filterRain = (arr) => {
    let result = {};

    result['mean'] = getMean(getDaytime(arr, 10, 20).map(e => e.value))
    result['max'] = Math.max(...getDaytime(arr, 10, 20).map(e => e.value))
    result['total'] = getSum(arr.map(e => e.value))

    return result;
}


const filterClouds = (arr) => {
    let result = {};

    result['mean'] = getMean(getDaytime(arr, 10, 20).map(e => e.value))
    result['mode'] = getMode(getDaytime(arr, 10, 20).map(e => e.value))

    return result;
}


/**
 * Filtering datapoints between given hours
 * @param {array} arr array of datapoints {'time': <dateobject>, 'value': <measurement>}
 * @param {int} start in hours from 0:00, ie 10 -> 10:00
 * @param {int} stop  in hours from 0:00, ie 20 -> 20:00
 * @returns {array} an array of datapoints between the given hours
 */
 const getDaytime = (arr, start, stop) => {
    let startDate = new Date(arr[0].time.getTime()).zeroHours().addHours(start)
    let stopDate = new Date(arr[0].time.getTime()).zeroHours().addHours(stop)

    return arr.filter(e => (e.time >= startDate && e.time <= stopDate))
}


const normalizeClouds = (x) => {return Math.round((8)*(x/100))}

const normalizeWindDirection = (x) => {
    let n = Math.round((8)*(x/360))
    return n === 8 ? 0 : n
    }




// Helpers -------------------------------------------------------------------------
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


const getMinMax = (arr) => {

    return {'min': Math.min(arr), 'max': Math.max(arr) }
}


const getMean = (arr) => {
    let sum = 0;

    arr.forEach(e => sum+=e)

    return sum/arr.length
}

const getMode = (arr) => {
    let modeArr = arr.map((e) => {return arr.filter(elm => e===elm).length})

    return arr[modeArr.indexOf(Math.max(...modeArr))]
}

const getSum = (arr) => {
    let sum = 0;
    arr.forEach(e => {sum += e})

    return sum;
}


export { filterDay, filterRain, filterWindDirection, getMode}