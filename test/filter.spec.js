import { assert, expect, should } from 'chai';
import { filterDay, filterRain, filterWindDirection, getMode } from '../src/filter.js';

const testData = {
    "tempC": [
      {
        "time":new Date("2022-09-03T21:00:00.000Z"),
        "value": 8
      },
      {
        "time":new Date("2022-09-03T22:00:00.000Z"),
        "value": 7
      },
      {
        "time":new Date("2022-09-03T23:00:00.000Z"),
        "value": 6.3
      },
      {
        "time":new Date("2022-09-04T00:00:00.000Z"),
        "value": 6.5
      },
      {
        "time":new Date("2022-09-04T01:00:00.000Z"),
        "value": 6.5
      },
      {
        "time":new Date("2022-09-04T02:00:00.000Z"),
        "value": 5.9
      },
      {
        "time":new Date("2022-09-04T03:00:00.000Z"),
        "value": 5.9
      },
      {
        "time":new Date("2022-09-04T04:00:00.000Z"),
        "value": 6.5
      },
      {
        "time":new Date("2022-09-04T05:00:00.000Z"),
        "value": 7.1
      },
      {
        "time":new Date("2022-09-04T06:00:00.000Z"),
        "value": 9
      },
      {
        "time":new Date("2022-09-04T07:00:00.000Z"),
        "value": 10.9
      },
      {
        "time":new Date("2022-09-04T08:00:00.000Z"),
        "value": 12.2
      },
      {
        "time":new Date("2022-09-04T09:00:00.000Z"),
        "value": 14.1
      },
      {
        "time":new Date("2022-09-04T10:00:00.000Z"),
        "value": 14.1
      },
      {
        "time":new Date("2022-09-04T11:00:00.000Z"),
        "value": 14.1
      },
      {
        "time":new Date("2022-09-04T12:00:00.000Z"),
        "value": 13.1
      },
      {
        "time":new Date("2022-09-04T13:00:00.000Z"),
        "value": 13.6
      },
      {
        "time":new Date("2022-09-04T14:00:00.000Z"),
        "value": 13.1
      },
      {
        "time":new Date("2022-09-04T15:00:00.000Z"),
        "value": 12.7
      },
      {
        "time":new Date("2022-09-04T16:00:00.000Z"),
        "value": 11.7
      },
      {
        "time":new Date("2022-09-04T17:00:00.000Z"),
        "value": 11.1
      },
      {
        "time":new Date("2022-09-04T18:00:00.000Z"),
        "value": 10.3
      },
      {
        "time":new Date("2022-09-04T19:00:00.000Z"),
        "value": 8.4
      },
      {
        "time":new Date("2022-09-04T20:00:00.000Z"),
        "value": 9.5
      }
    ],
    "windSpeed": [
      {
        "time":new Date("2022-09-03T21:00:00.000Z"),
        "value": 2.8
      },
      {
        "time":new Date("2022-09-03T22:00:00.000Z"),
        "value": 2.2
      },
      {
        "time":new Date("2022-09-03T23:00:00.000Z"),
        "value": 3.5
      },
      {
        "time":new Date("2022-09-04T00:00:00.000Z"),
        "value": 3.8
      },
      {
        "time":new Date("2022-09-04T01:00:00.000Z"),
        "value": 3.7
      },
      {
        "time":new Date("2022-09-04T02:00:00.000Z"),
        "value": 2.8
      },
      {
        "time":new Date("2022-09-04T03:00:00.000Z"),
        "value": 3.5
      },
      {
        "time":new Date("2022-09-04T04:00:00.000Z"),
        "value": 4.1
      },
      {
        "time":new Date("2022-09-04T05:00:00.000Z"),
        "value": 3.8
      },
      {
        "time":new Date("2022-09-04T06:00:00.000Z"),
        "value": 4
      },
      {
        "time":new Date("2022-09-04T07:00:00.000Z"),
        "value": 3.7
      },
      {
        "time":new Date("2022-09-04T08:00:00.000Z"),
        "value": 4.4
      },
      {
        "time":new Date("2022-09-04T09:00:00.000Z"),
        "value": 5.5
      },
      {
        "time":new Date("2022-09-04T10:00:00.000Z"),
        "value": 4.7
      },
      {
        "time":new Date("2022-09-04T11:00:00.000Z"),
        "value": 3.5
      },
      {
        "time":new Date("2022-09-04T12:00:00.000Z"),
        "value": 5.8
      },
      {
        "time":new Date("2022-09-04T13:00:00.000Z"),
        "value": 5.1
      },
      {
        "time":new Date("2022-09-04T14:00:00.000Z"),
        "value": 5.1
      },
      {
        "time":new Date("2022-09-04T15:00:00.000Z"),
        "value": 5.7
      },
      {
        "time":new Date("2022-09-04T16:00:00.000Z"),
        "value": 3.8
      },
      {
        "time":new Date("2022-09-04T17:00:00.000Z"),
        "value": 2.3
      },
      {
        "time":new Date("2022-09-04T18:00:00.000Z"),
        "value": 1.9
      },
      {
        "time":new Date("2022-09-04T19:00:00.000Z"),
        "value": 1.9
      },
      {
        "time":new Date("2022-09-04T20:00:00.000Z"),
        "value": 2
      }
    ],
    "windGust": [
      {
        "time":new Date("2022-09-03T21:00:00.000Z"),
        "value": 4.4
      },
      {
        "time":new Date("2022-09-03T22:00:00.000Z"),
        "value": 3.2
      },
      {
        "time":new Date("2022-09-03T23:00:00.000Z"),
        "value": 4.7
      },
      {
        "time":new Date("2022-09-04T00:00:00.000Z"),
        "value": 5
      },
      {
        "time":new Date("2022-09-04T01:00:00.000Z"),
        "value": 5
      },
      {
        "time":new Date("2022-09-04T02:00:00.000Z"),
        "value": 4.1
      },
      {
        "time":new Date("2022-09-04T03:00:00.000Z"),
        "value": 4.8
      },
      {
        "time":new Date("2022-09-04T04:00:00.000Z"),
        "value": 5.7
      },
      {
        "time":new Date("2022-09-04T05:00:00.000Z"),
        "value": 5.3
      },
      {
        "time":new Date("2022-09-04T06:00:00.000Z"),
        "value": 5.9
      },
      {
        "time":new Date("2022-09-04T07:00:00.000Z"),
        "value": 6.2
      },
      {
        "time":new Date("2022-09-04T08:00:00.000Z"),
        "value": 6.9
      },
      {
        "time":new Date("2022-09-04T09:00:00.000Z"),
        "value": 8.8
      },
      {
        "time":new Date("2022-09-04T10:00:00.000Z"),
        "value": 7.2
      },
      {
        "time":new Date("2022-09-04T11:00:00.000Z"),
        "value": 5.5
      },
      {
        "time":new Date("2022-09-04T12:00:00.000Z"),
        "value": 9.5
      },
      {
        "time":new Date("2022-09-04T13:00:00.000Z"),
        "value": 8.2
      },
      {
        "time":new Date("2022-09-04T14:00:00.000Z"),
        "value": 8.6
      },
      {
        "time":new Date("2022-09-04T15:00:00.000Z"),
        "value": 9.4
      },
      {
        "time":new Date("2022-09-04T16:00:00.000Z"),
        "value": 6.7
      },
      {
        "time":new Date("2022-09-04T17:00:00.000Z"),
        "value": 4
      },
      {
        "time":new Date("2022-09-04T18:00:00.000Z"),
        "value": 2.8
      },
      {
        "time":new Date("2022-09-04T19:00:00.000Z"),
        "value": 2.7
      },
      {
        "time":new Date("2022-09-04T20:00:00.000Z"),
        "value": 3.9
      }
    ],
    "windDirection": [
      {
        "time":new Date("2022-09-03T21:00:00.000Z"),
        "value": 322
      },
      {
        "time":new Date("2022-09-03T22:00:00.000Z"),
        "value": 326
      },
      {
        "time":new Date("2022-09-03T23:00:00.000Z"),
        "value": 328
      },
      {
        "time":new Date("2022-09-04T00:00:00.000Z"),
        "value": 328
      },
      {
        "time":new Date("2022-09-04T01:00:00.000Z"),
        "value": 327
      },
      {
        "time":new Date("2022-09-04T02:00:00.000Z"),
        "value": 326
      },
      {
        "time":new Date("2022-09-04T03:00:00.000Z"),
        "value": 330
      },
      {
        "time":new Date("2022-09-04T04:00:00.000Z"),
        "value": 327
      },
      {
        "time":new Date("2022-09-04T05:00:00.000Z"),
        "value": 329
      },
      {
        "time":new Date("2022-09-04T06:00:00.000Z"),
        "value": 330
      },
      {
        "time":new Date("2022-09-04T07:00:00.000Z"),
        "value": 342
      },
      {
        "time":new Date("2022-09-04T08:00:00.000Z"),
        "value": 331
      },
      {
        "time":new Date("2022-09-04T09:00:00.000Z"),
        "value": 338
      },
      {
        "time":new Date("2022-09-04T10:00:00.000Z"),
        "value": 342
      },
      {
        "time":new Date("2022-09-04T11:00:00.000Z"),
        "value": 332
      },
      {
        "time":new Date("2022-09-04T12:00:00.000Z"),
        "value": 329
      },
      {
        "time":new Date("2022-09-04T13:00:00.000Z"),
        "value": 347
      },
      {
        "time":new Date("2022-09-04T14:00:00.000Z"),
        "value": 351
      },
      {
        "time":new Date("2022-09-04T15:00:00.000Z"),
        "value": 346
      },
      {
        "time":new Date("2022-09-04T16:00:00.000Z"),
        "value": 22
      },
      {
        "time":new Date("2022-09-04T17:00:00.000Z"),
        "value": 33
      },
      {
        "time":new Date("2022-09-04T18:00:00.000Z"),
        "value": 53
      },
      {
        "time":new Date("2022-09-04T19:00:00.000Z"),
        "value": 16
      },
      {
        "time":new Date("2022-09-04T20:00:00.000Z"),
        "value": 25
      }
    ],
    "relativeHumidity": [
      {
        "time":new Date("2022-09-03T21:00:00.000Z"),
        "value": 77
      },
      {
        "time":new Date("2022-09-03T22:00:00.000Z"),
        "value": 81
      },
      {
        "time":new Date("2022-09-03T23:00:00.000Z"),
        "value": 86
      },
      {
        "time":new Date("2022-09-04T00:00:00.000Z"),
        "value": 86
      },
      {
        "time":new Date("2022-09-04T01:00:00.000Z"),
        "value": 87
      },
      {
        "time":new Date("2022-09-04T02:00:00.000Z"),
        "value": 90
      },
      {
        "time":new Date("2022-09-04T03:00:00.000Z"),
        "value": 90
      },
      {
        "time":new Date("2022-09-04T04:00:00.000Z"),
        "value": 88
      },
      {
        "time":new Date("2022-09-04T05:00:00.000Z"),
        "value": 86
      },
      {
        "time":new Date("2022-09-04T06:00:00.000Z"),
        "value": 80
      },
      {
        "time":new Date("2022-09-04T07:00:00.000Z"),
        "value": 70
      },
      {
        "time":new Date("2022-09-04T08:00:00.000Z"),
        "value": 65
      },
      {
        "time":new Date("2022-09-04T09:00:00.000Z"),
        "value": 51
      },
      {
        "time":new Date("2022-09-04T10:00:00.000Z"),
        "value": 51
      },
      {
        "time":new Date("2022-09-04T11:00:00.000Z"),
        "value": 47
      },
      {
        "time":new Date("2022-09-04T12:00:00.000Z"),
        "value": 47
      },
      {
        "time":new Date("2022-09-04T13:00:00.000Z"),
        "value": 44
      },
      {
        "time":new Date("2022-09-04T14:00:00.000Z"),
        "value": 48
      },
      {
        "time":new Date("2022-09-04T15:00:00.000Z"),
        "value": 47
      },
      {
        "time":new Date("2022-09-04T16:00:00.000Z"),
        "value": 50
      },
      {
        "time":new Date("2022-09-04T17:00:00.000Z"),
        "value": 52
      },
      {
        "time":new Date("2022-09-04T18:00:00.000Z"),
        "value": 57
      },
      {
        "time":new Date("2022-09-04T19:00:00.000Z"),
        "value": 67
      },
      {
        "time":new Date("2022-09-04T20:00:00.000Z"),
        "value": 61
      }
    ],
    "tempCDewPoint": [
      {
        "time":new Date("2022-09-03T21:00:00.000Z"),
        "value": 4.2
      },
      {
        "time":new Date("2022-09-03T22:00:00.000Z"),
        "value": 3.9
      },
      {
        "time":new Date("2022-09-03T23:00:00.000Z"),
        "value": 4.1
      },
      {
        "time":new Date("2022-09-04T00:00:00.000Z"),
        "value": 4.3
      },
      {
        "time":new Date("2022-09-04T01:00:00.000Z"),
        "value": 4.5
      },
      {
        "time":new Date("2022-09-04T02:00:00.000Z"),
        "value": 4.3
      },
      {
        "time":new Date("2022-09-04T03:00:00.000Z"),
        "value": 4.4
      },
      {
        "time":new Date("2022-09-04T04:00:00.000Z"),
        "value": 4.7
      },
      {
        "time":new Date("2022-09-04T05:00:00.000Z"),
        "value": 5
      },
      {
        "time":new Date("2022-09-04T06:00:00.000Z"),
        "value": 5.7
      },
      {
        "time":new Date("2022-09-04T07:00:00.000Z"),
        "value": 5.7
      },
      {
        "time":new Date("2022-09-04T08:00:00.000Z"),
        "value": 5.9
      },
      {
        "time":new Date("2022-09-04T09:00:00.000Z"),
        "value": 4.2
      },
      {
        "time":new Date("2022-09-04T10:00:00.000Z"),
        "value": 4.1
      },
      {
        "time":new Date("2022-09-04T11:00:00.000Z"),
        "value": 2.9
      },
      {
        "time":new Date("2022-09-04T12:00:00.000Z"),
        "value": 2.1
      },
      {
        "time":new Date("2022-09-04T13:00:00.000Z"),
        "value": 1.7
      },
      {
        "time":new Date("2022-09-04T14:00:00.000Z"),
        "value": 2.2
      },
      {
        "time":new Date("2022-09-04T15:00:00.000Z"),
        "value": 1.6
      },
      {
        "time":new Date("2022-09-04T16:00:00.000Z"),
        "value": 1.6
      },
      {
        "time":new Date("2022-09-04T17:00:00.000Z"),
        "value": 1.7
      },
      {
        "time":new Date("2022-09-04T18:00:00.000Z"),
        "value": 2.1
      },
      {
        "time":new Date("2022-09-04T19:00:00.000Z"),
        "value": 2.8
      },
      {
        "time":new Date("2022-09-04T20:00:00.000Z"),
        "value": 2.5
      }
    ],
    "rain_1h": [
      {
        "time":new Date("2022-09-03T21:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-03T22:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-03T23:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T00:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T01:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T02:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T03:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T04:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T05:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T06:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T07:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T08:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T09:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T10:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T11:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T12:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T13:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T14:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T15:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T16:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T17:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T18:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T19:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T20:00:00.000Z"),
        "value": 0
      }
    ],
    "ri_10min": [
      {
        "time":new Date("2022-09-03T21:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-03T22:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-03T23:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T00:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T01:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T02:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T03:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T04:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T05:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T06:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T07:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T08:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T09:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T10:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T11:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T12:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T13:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T14:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T15:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T16:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T17:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T18:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T19:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T20:00:00.000Z"),
        "value": 0
      }
    ],
    "snow": [
      {
        "time":new Date("2022-09-03T21:00:00.000Z"),
        "value": -1
      },
      {
        "time":new Date("2022-09-03T22:00:00.000Z"),
        "value": -1
      },
      {
        "time":new Date("2022-09-03T23:00:00.000Z"),
        "value": -1
      },
      {
        "time":new Date("2022-09-04T00:00:00.000Z"),
        "value": -1
      },
      {
        "time":new Date("2022-09-04T01:00:00.000Z"),
        "value": -1
      },
      {
        "time":new Date("2022-09-04T02:00:00.000Z"),
        "value": -1
      },
      {
        "time":new Date("2022-09-04T03:00:00.000Z"),
        "value": -1
      },
      {
        "time":new Date("2022-09-04T04:00:00.000Z"),
        "value": -1
      },
      {
        "time":new Date("2022-09-04T05:00:00.000Z"),
        "value": -1
      },
      {
        "time":new Date("2022-09-04T06:00:00.000Z"),
        "value": -1
      },
      {
        "time":new Date("2022-09-04T07:00:00.000Z"),
        "value": -1
      },
      {
        "time":new Date("2022-09-04T08:00:00.000Z"),
        "value": -1
      },
      {
        "time":new Date("2022-09-04T09:00:00.000Z"),
        "value": -1
      },
      {
        "time":new Date("2022-09-04T10:00:00.000Z"),
        "value": -1
      },
      {
        "time":new Date("2022-09-04T11:00:00.000Z"),
        "value": -1
      },
      {
        "time":new Date("2022-09-04T12:00:00.000Z"),
        "value": -1
      },
      {
        "time":new Date("2022-09-04T13:00:00.000Z"),
        "value": -1
      },
      {
        "time":new Date("2022-09-04T14:00:00.000Z"),
        "value": -1
      },
      {
        "time":new Date("2022-09-04T15:00:00.000Z"),
        "value": -1
      },
      {
        "time":new Date("2022-09-04T16:00:00.000Z"),
        "value": -1
      },
      {
        "time":new Date("2022-09-04T17:00:00.000Z"),
        "value": -1
      },
      {
        "time":new Date("2022-09-04T18:00:00.000Z"),
        "value": -1
      },
      {
        "time":new Date("2022-09-04T19:00:00.000Z"),
        "value": -1
      },
      {
        "time":new Date("2022-09-04T20:00:00.000Z"),
        "value": -1
      }
    ],
    "airPressureSea": [
      {
        "time":new Date("2022-09-03T21:00:00.000Z"),
        "value": 1024.5
      },
      {
        "time":new Date("2022-09-03T22:00:00.000Z"),
        "value": 1024.8
      },
      {
        "time":new Date("2022-09-03T23:00:00.000Z"),
        "value": 1025
      },
      {
        "time":new Date("2022-09-04T00:00:00.000Z"),
        "value": 1025.1
      },
      {
        "time":new Date("2022-09-04T01:00:00.000Z"),
        "value": 1025.2
      },
      {
        "time":new Date("2022-09-04T02:00:00.000Z"),
        "value": 1025.4
      },
      {
        "time":new Date("2022-09-04T03:00:00.000Z"),
        "value": 1025.5
      },
      {
        "time":new Date("2022-09-04T04:00:00.000Z"),
        "value": 1025.7
      },
      {
        "time":new Date("2022-09-04T05:00:00.000Z"),
        "value": 1026.2
      },
      {
        "time":new Date("2022-09-04T06:00:00.000Z"),
        "value": 1026.3
      },
      {
        "time":new Date("2022-09-04T07:00:00.000Z"),
        "value": 1026.6
      },
      {
        "time":new Date("2022-09-04T08:00:00.000Z"),
        "value": 1026.8
      },
      {
        "time":new Date("2022-09-04T09:00:00.000Z"),
        "value": 1026.8
      },
      {
        "time":new Date("2022-09-04T10:00:00.000Z"),
        "value": 1026.9
      },
      {
        "time":new Date("2022-09-04T11:00:00.000Z"),
        "value": 1027
      },
      {
        "time":new Date("2022-09-04T12:00:00.000Z"),
        "value": 1027.2
      },
      {
        "time":new Date("2022-09-04T13:00:00.000Z"),
        "value": 1027.3
      },
      {
        "time":new Date("2022-09-04T14:00:00.000Z"),
        "value": 1027.5
      },
      {
        "time":new Date("2022-09-04T15:00:00.000Z"),
        "value": 1027.6
      },
      {
        "time":new Date("2022-09-04T16:00:00.000Z"),
        "value": 1027.7
      },
      {
        "time":new Date("2022-09-04T17:00:00.000Z"),
        "value": 1028
      },
      {
        "time":new Date("2022-09-04T18:00:00.000Z"),
        "value": 1028.6
      },
      {
        "time":new Date("2022-09-04T19:00:00.000Z"),
        "value": 1029
      },
      {
        "time":new Date("2022-09-04T20:00:00.000Z"),
        "value": 1029.4
      }
    ],
    "visibility": [
      {
        "time":new Date("2022-09-03T21:00:00.000Z"),
        "value": 50000
      },
      {
        "time":new Date("2022-09-03T22:00:00.000Z"),
        "value": 50000
      },
      {
        "time":new Date("2022-09-03T23:00:00.000Z"),
        "value": 50000
      },
      {
        "time":new Date("2022-09-04T00:00:00.000Z"),
        "value": 50000
      },
      {
        "time":new Date("2022-09-04T01:00:00.000Z"),
        "value": 50000
      },
      {
        "time":new Date("2022-09-04T02:00:00.000Z"),
        "value": 50000
      },
      {
        "time":new Date("2022-09-04T03:00:00.000Z"),
        "value": 50000
      },
      {
        "time":new Date("2022-09-04T04:00:00.000Z"),
        "value": 50000
      },
      {
        "time":new Date("2022-09-04T05:00:00.000Z"),
        "value": 50000
      },
      {
        "time":new Date("2022-09-04T06:00:00.000Z"),
        "value": 50000
      },
      {
        "time":new Date("2022-09-04T07:00:00.000Z"),
        "value": 47510
      },
      {
        "time":new Date("2022-09-04T08:00:00.000Z"),
        "value": 50000
      },
      {
        "time":new Date("2022-09-04T09:00:00.000Z"),
        "value": 50000
      },
      {
        "time":new Date("2022-09-04T10:00:00.000Z"),
        "value": 50000
      },
      {
        "time":new Date("2022-09-04T11:00:00.000Z"),
        "value": 46860
      },
      {
        "time":new Date("2022-09-04T12:00:00.000Z"),
        "value": 50000
      },
      {
        "time":new Date("2022-09-04T13:00:00.000Z"),
        "value": 50000
      },
      {
        "time":new Date("2022-09-04T14:00:00.000Z"),
        "value": 50000
      },
      {
        "time":new Date("2022-09-04T15:00:00.000Z"),
        "value": 50000
      },
      {
        "time":new Date("2022-09-04T16:00:00.000Z"),
        "value": 50000
      },
      {
        "time":new Date("2022-09-04T17:00:00.000Z"),
        "value": 50000
      },
      {
        "time":new Date("2022-09-04T18:00:00.000Z"),
        "value": 50000
      },
      {
        "time":new Date("2022-09-04T19:00:00.000Z"),
        "value": 50000
      },
      {
        "time":new Date("2022-09-04T20:00:00.000Z"),
        "value": 50000
      }
    ],
    "cloudCoverage": [
      {
        "time":new Date("2022-09-03T21:00:00.000Z"),
        "value": 5
      },
      {
        "time":new Date("2022-09-03T22:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-03T23:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T00:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T01:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T02:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T03:00:00.000Z"),
        "value": 7
      },
      {
        "time":new Date("2022-09-04T04:00:00.000Z"),
        "value": 7
      },
      {
        "time":new Date("2022-09-04T05:00:00.000Z"),
        "value": 3
      },
      {
        "time":new Date("2022-09-04T06:00:00.000Z"),
        "value": 1
      },
      {
        "time":new Date("2022-09-04T07:00:00.000Z"),
        "value": 1
      },
      {
        "time":new Date("2022-09-04T08:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T09:00:00.000Z"),
        "value": 3
      },
      {
        "time":new Date("2022-09-04T10:00:00.000Z"),
        "value": 7
      },
      {
        "time":new Date("2022-09-04T11:00:00.000Z"),
        "value": 5
      },
      {
        "time":new Date("2022-09-04T12:00:00.000Z"),
        "value": 5
      },
      {
        "time":new Date("2022-09-04T13:00:00.000Z"),
        "value": 5
      },
      {
        "time":new Date("2022-09-04T14:00:00.000Z"),
        "value": 7
      },
      {
        "time":new Date("2022-09-04T15:00:00.000Z"),
        "value": 1
      },
      {
        "time":new Date("2022-09-04T16:00:00.000Z"),
        "value": 5
      },
      {
        "time":new Date("2022-09-04T17:00:00.000Z"),
        "value": 5
      },
      {
        "time":new Date("2022-09-04T18:00:00.000Z"),
        "value": 1
      },
      {
        "time":new Date("2022-09-04T19:00:00.000Z"),
        "value": 1
      },
      {
        "time":new Date("2022-09-04T20:00:00.000Z"),
        "value": 7
      }
    ],
    "wawa": [
      {
        "time":new Date("2022-09-03T21:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-03T22:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-03T23:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T00:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T01:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T02:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T03:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T04:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T05:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T06:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T07:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T08:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T09:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T10:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T11:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T12:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T13:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T14:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T15:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T16:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T17:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T18:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T19:00:00.000Z"),
        "value": 0
      },
      {
        "time":new Date("2022-09-04T20:00:00.000Z"),
        "value": 0
      }
    ]
  };


describe('Filter.js', () => {
    describe('filterDay()', () => {
        it('Should return only relevant bits of data', () => {
            let result;

            result = filterDay(testData);

            expect(result).to.not.be.a('undefined');
            expect(result).to.include.all.keys('tempC', 'windSpeed', 'windDirection', 'cloudCoverage', 'rain_1h');
            
            expect(result.tempC).to.include.all.keys('mean', 'min', 'max');
            expect(result.tempC.max).to.be.above(result.tempC.min);
            expect(result.tempC.mean).to.be.above(result.tempC.min);

            expect(result.windSpeed).to.include.all.keys('mean', 'min', 'max');
            expect(result.windSpeed.max).to.be.above(result.windSpeed.min);
            expect(result.windSpeed.mean).to.be.above(result.windSpeed.min);

            expect(result.windDirection).to.include.all.keys('mode');
            expect(result.windDirection.mode).to.be.within(0,7);

            expect(result.cloudCoverage).to.include.all.keys('mean', 'mode');
            expect(result.cloudCoverage.mean).to.be.within(0,8);
            expect(result.cloudCoverage.mode).to.be.within(0,8);

            expect(result.rain_1h).to.include.all.keys('mean', 'max', 'total');
            expect(result.rain_1h.total).to.be.least(result.rain_1h.max);
            expect(result.rain_1h.mean).to.be.most(result.rain_1h.max);
        });
    });


    describe('getMode()', () => {
        it('Should return mode of an array of numbers', () => {
            let numbers = [1,2,3,3,3,5];

            expect(getMode(numbers)).to.equal(3);

        });
    });

    describe('filterWindDirection()', () => {
        it('Should return a number between 1-8', () => {
            let testData = [
                {
                  "time": new Date("2022-09-03T21:00:00.000Z"),
                  "value": 322
                },
                {
                  "time": new Date("2022-09-03T22:00:00.000Z"),
                  "value": 326
                },
                {
                  "time": new Date("2022-09-03T23:00:00.000Z"),
                  "value": 328
                },
                {
                  "time": new Date("2022-09-04T00:00:00.000Z"),
                  "value": 328
                },
                {
                  "time": new Date("2022-09-04T01:00:00.000Z"),
                  "value": 327
                },
                {
                  "time": new Date("2022-09-04T02:00:00.000Z"),
                  "value": 326
                },
                {
                  "time": new Date("2022-09-04T03:00:00.000Z"),
                  "value": 330
                },
                {
                  "time": new Date("2022-09-04T04:00:00.000Z"),
                  "value": 327
                },
                {
                  "time": new Date("2022-09-04T05:00:00.000Z"),
                  "value": 329
                },
                {
                  "time": new Date("2022-09-04T06:00:00.000Z"),
                  "value": 330
                },
                {
                  "time": new Date("2022-09-04T07:00:00.000Z"),
                  "value": 342
                },
                {
                  "time": new Date("2022-09-04T08:00:00.000Z"),
                  "value": 331
                },
                {
                  "time": new Date("2022-09-04T09:00:00.000Z"),
                  "value": 338
                },
                {
                  "time": new Date("2022-09-04T10:00:00.000Z"),
                  "value": 342
                },
                {
                  "time": new Date("2022-09-04T11:00:00.000Z"),
                  "value": 332
                },
                {
                  "time": new Date("2022-09-04T12:00:00.000Z"),
                  "value": 329
                },
                {
                  "time": new Date("2022-09-04T13:00:00.000Z"),
                  "value": 347
                },
                {
                  "time": new Date("2022-09-04T14:00:00.000Z"),
                  "value": 351
                },
                {
                  "time": new Date("2022-09-04T15:00:00.000Z"),
                  "value": 346
                },
                {
                  "time": new Date("2022-09-04T16:00:00.000Z"),
                  "value": 22
                },
                {
                  "time": new Date("2022-09-04T17:00:00.000Z"),
                  "value": 33
                },
                {
                  "time": new Date("2022-09-04T18:00:00.000Z"),
                  "value": 53
                },
                {
                  "time": new Date("2022-09-04T19:00:00.000Z"),
                  "value": 16
                },
                {
                  "time": new Date("2022-09-04T20:00:00.000Z"),
                  "value": 25
                }
              ];

            let result = filterWindDirection(testData);

            expect(result.mode).to.be.within(0,8);
        });
    });

    describe('filterRain()', () => {
        it('Should return an object with (max, mean, total) rain fall.', () => {
            let testData = [{
                "time": new Date("2022-09-03T21:00:00.000Z"),
                "value": 20
              },
              {
                "time": new Date("2022-09-04T10:00:00.000Z"),
                "value": 1
              },
              {
                "time": new Date("2022-09-04T11:00:00.000Z"),
                "value": 1
              },
              {
                "time": new Date("2022-09-04T12:00:00.000Z"),
                "value": 10
            }];

            let result = filterRain(testData);

            expect(result).to.be.a('object');
            expect(result.mean).to.be.below(result.max);
            expect(result.total).to.be.at.least(result.max);
        });
    });
});