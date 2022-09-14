import { assert, expect, should } from 'chai';  // Using Assert style
import {storage} from '../src/storage.js';


// Config test data
let testData = {
    "tempC": [
        {
          "time": "2022-08-23T21:00:00.000Z",
          "value": 18.4
        },
        {
          "time": "2022-08-23T22:00:00.000Z",
          "value": 18.7
        }
    ],
    "relativeHumidity": [
        {
        "time": "2022-08-23T21:00:00.000Z",
        "value": 82
        },
        {
        "time": "2022-08-23T22:00:00.000Z",
        "value": 82
        },
    ]
};

let testData2 = {
    "tempC": [
        {
          "time": "2022-07-23T21:00:00.000Z",
          "value": 99.9
        },
        {
          "time": "2022-07-23T22:00:00.000Z",
          "value": 20.1
        }
    ],
    "relativeHumidity": [
        {
        "time": "2022-07-23T21:00:00.000Z",
        "value": 22
        },
        {
        "time": "2022-07-23T22:00:00.000Z",
        "value": 11
        },
    ]
};


describe('Storage', () => {
    
    describe('today', () => {
        let dataStorage = storage();

            it('Add() data and then get() data', () => {
                dataStorage.today.add("test", testData);

                expect(dataStorage.today.get("test")).to.deep.equal(testData);
            });

            it('Update() data and then get() data', () => {
                dataStorage.today.update("test", testData2);

                expect(dataStorage.today.get("test")).to.deep.equal(testData2);
            });

            it('Destroy() and then try to get()', () => {
                expect(dataStorage.today.get("test")).to.not.be.a('undefined');

                dataStorage.today.destroy("test");

                expect(dataStorage.today.get("test")).to.be.a('undefined');
            });
    });

    describe('yesterday', () => {
        let dataStorage = storage();

            it('Add() data and then get() data', () => {
                dataStorage.yesterday.add("test", testData);

                expect(dataStorage.yesterday.get("test")).to.deep.equal(testData);
            });

            it('Update() data and then get() data', () => {
                dataStorage.yesterday.update("test", testData2);

                expect(dataStorage.yesterday.get("test")).to.deep.equal(testData2);
            });

            it('Destroy() and then try to get()', () => {
                expect(dataStorage.yesterday.get("test")).to.not.be.a('undefined');

                dataStorage.yesterday.destroy("test");

                expect(dataStorage.yesterday.get("test")).to.be.a('undefined');
            });
    });

    describe('daybefore', () => {
        let dataStorage = storage();

            it('Add() data and then get() data', () => {
                dataStorage.daybefore.add("test", testData);

                expect(dataStorage.daybefore.get("test")).to.deep.equal(testData);
            });

            it('Update() data and then get() data', () => {
                dataStorage.daybefore.update("test", testData2);

                expect(dataStorage.daybefore.get("test")).to.deep.equal(testData2);
            });

            it('Destroy() and then try to get()', () => {
                expect(dataStorage.daybefore.get("test")).to.not.be.a('undefined');

                dataStorage.daybefore.destroy("test");

                expect(dataStorage.daybefore.get("test")).to.be.a('undefined');
            });

    });

    describe('rollForwards', () => {
        let dataStorage = storage();

        it('Roll data from today -> yesterday -> daybefore', () => {
            dataStorage.today.add('test', testData);
            dataStorage.rollForwards();
            dataStorage.today.add('test', testData2);
            dataStorage.rollForwards();

            expect(dataStorage.daybefore.get('test')).to.deep.equal(testData);
            expect(dataStorage.yesterday.get('test')).to.deep.equal(testData2);
            expect(dataStorage.today.get('test')).to.be.a('undefined');

        });
    });
});
