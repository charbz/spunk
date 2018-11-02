const assert = require('assert');
const Spunk = require('../spunk');
const prices = Spunk.ArrayProvider({ data: [20,22,24,25,23,26,28,26,29] });

/****************************************
 * Testing moving average functionality
 * with an MA of size 10. (SIZE=10)
 ****************************************/

describe('MovingAverage', function() {
      const MA10 = Spunk.MovingAverage({ source: prices, size: 10 });
    it('should have 0 elements when source has only 9 elements', function() {
      assert.equal(MA10.getData().length, 0);
    });
    it('should have 1 element when source has 10 elements', function() {
      prices.add(27);
      assert.equal(MA10.getData().length, 1);
    });
    it('should calculate the correct values as source array grows', function() {
      prices.add(28);
      prices.add(30);
      prices.add(27);
      prices.add(29);
      prices.add(28);
      assert.deepEqual(MA10.getData(), [25,25.8,26.6,26.9,27.3,27.8]);
    });
    it('should initialize with the correct values', function() {
      const testMA = Spunk.MovingAverage({ source: prices, size: 10 });
      assert.deepEqual(testMA.getData(), [25,25.8,26.6,26.9,27.3,27.8]);
    });
});
