import { assert, expect, should } from 'chai';
import { filterDay, filterRain, filterWindDirection, getMode } from '../src/filter.js';

const testData = {}


describe('Filter.js', () => {
    describe('filterData()', () => {
        it('Should return only relevant bits of data', () => {
            
        })
    })


    describe('getMode()', () => {
        it('Should return mode of an array of numbers', () => {
            let numbers = [1,2,3,3,3,5]

            expect(getMode(numbers)).to.equal(3)

        })
    })

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
              ]

            let result = filterWindDirection(testData)

            expect(result).to.be.within(0,8)
        })
    })

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
            }]

            let result = filterRain(testData)

            expect(result).to.be.a('object')
            expect(result.mean).to.be.below(result.max)
            expect(result.total).to.be.at.least(result.max)
        })

    })
})