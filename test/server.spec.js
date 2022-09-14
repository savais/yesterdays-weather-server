import { assert, expect, should } from 'chai';  // Using Assert style
import fetch from 'node-fetch';
import {app} from '../src/server.js';
const port = 3000;
const baseurl = `http://localhost:${port}/api/`;
let server;

describe('REST testing', () => {
    before('Start the server', async () => {
        server = app.listen(port);
    });


    it('GET /api/ - Should return 200', async () => {
        const res = await fetch(baseurl);
        expect(res.status).to.equal(200);
    });

    it('GET /api/:city - should return processed weather data for {today, yesterday, daybefore}', async () => {
        const res = await fetch(baseurl+"helsinki");
        expect(res.status).to.equal(200);
        const body = await res.json();

        expect(body).to.have.all.keys(['today', 'yesterday', 'daybefore']);

        Object.keys(body).forEach((key) => {
            expect(body[key]).to.have.any.keys(['tempC', 'windSpeed', 'windDirection', 'cloudCoverage', 'rain_1h']);
        });
    });

    it('GET /api/:city/today - should return forecast', async () => {
        const res = await fetch(baseurl+"helsinki/today");
        expect(res.status).to.equal(200);
        const body = await res.json();

        expect(body.tempC[0]).to.be.a('object');
        expect(body.tempC[0].value).to.be.within(-40, 40);
        expect(new Date(body.tempC[0].time)).to.be.within(new Date().zeroHours(), new Date());
    });

    it('GET /api/:city/yesterday - should return forecast', async () => {
        const res = await fetch(baseurl+"helsinki/yesterday");
        expect(res.status).to.equal(200);
        const body = await res.json();

        expect(body.tempC[0]).to.be.a('object');
        expect(body.tempC[0].value).to.be.within(-40, 40);
        expect(new Date(body.tempC[0].time)).to.deep.equal(new Date().zeroHours().addHours(-24));
    });

    it('GET /api/:city/daybefore - should return forecast', async () => {
        const res = await fetch(baseurl+"helsinki/daybefore");
        expect(res.status).to.equal(200);
        const body = await res.json();

        expect(body.tempC[0]).to.be.a('object');
        expect(body.tempC[0].value).to.be.within(-40, 40);
        expect(new Date(body.tempC[0].time)).to.deep.equal(new Date().zeroHours().addHours(-48));
    });

    after('Close the server', () => {
        server.close();
    });
});


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