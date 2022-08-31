import {GetObservation, GetForecast} from "../src/ezfmio/ezfmio.js";
import { assert, expect, should } from 'chai';  // Using Assert style

let obsTestDate = new Date().addHours(-24)
let obsExpectedDate = new Date().zeroHours().addHours(-24)
let foreTestDate = new Date().addHours(24)
let foreExpectedDate = new Date().zeroHours().addHours(24)

describe('EzFMIO', () => {
    describe('GetObservation(city, date)', () => {
        it('should return observations for the closest weatherstation to the city for the given date', () => {
            return GetObservation('Helsinki', obsTestDate).then(results => {
                expect(results).to.be.a('object');
                expect(results.tempC).to.have.lengthOf(24)
                expect(results.tempC[0].time).to.be.a('date')
                expect(results.tempC[0].value).to.be.a('number')

                expect(new Date(results.tempC[0].time)).to.eql(obsExpectedDate)
                expect(results.tempC[0].value).to.be.within(-40,40)
            })
            
            
        })
    })

    describe('GetForecast(city, date)', () => {
        it('should return forecast for the city for the given date', () => {
            return GetForecast('Helsinki ', foreTestDate).then(results => {
                expect(results).to.be.a('object');
                expect(results.tempC).to.have.lengthOf(24)

                expect(results.tempC[0].time).to.be.a('date')
                expect(results.tempC[0].value).to.be.a('number')

                expect(results.tempC[0].time).to.eql(foreExpectedDate)
                expect(results.tempC[0].value).to.be.within(-40,40)
            })
            
            
        })
    })
})






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