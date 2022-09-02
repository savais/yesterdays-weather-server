import { assert, expect, should } from 'chai';
import { filterData } from '../src/filter.js';

const testData = {}


describe('Filter.js', () => {
    describe('filterData()', () => {
        it('Should return only relevant bits of data', () => {
            const filteredData = filterData(testData, testData, testData);

            expect(filteredData).to.have.all.keys('today', 'yesterday', 'daybefore');
            expect(filteredData.today).to.have.all.keys('tempC','windSpeed','windDirection','cloudCoverage','rain_1h');
        })
    })
})