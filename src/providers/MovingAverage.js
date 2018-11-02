const _ = require('lodash');
const DataProvider = require('../core/DataProvider');

/**********************************************
 * @class MovingAverage
 * @implements DataProvider
 * provides a moving average based on another
 * dataprovider as a source.
 **********************************************/

class MovingAverage extends DataProvider {

  /*****************************************************************
   * @constructor MovingAverage()
   * @param data {}
   * @param data.source (DataProviderInstance)
   * @param data.size (Number)
   * @param data.key (String) optional key to specify
   * name of the key where value is to be found in source's elements
   ******************************************************************/

  constructor(options) {
     options.name = options.name || 'MovingAverage';
     super(options);
     if (!(options.source instanceof DataProvider)) {
      this.throwError('must be initialized with source as a DataProvider Instance');
     }
     this.size = options.size || 10;
     this.key = options.key || false;
     this.load();
   }

  /*******************************************
   * @function load()
   * subclasses must implement load function
   *******************************************/

  load() {
    this.data = [];
    this.calculateHistoricalMA();
    this.source.addEventListener('update',this.calculateNextMA.bind(this));
    this.onLoad();
  }

  /*******************************************
   * @function calculateNextMA()
   * calculates the moving average of the
   * source DataProvider at each new update
   *******************************************/

  calculateNextMA() {
    let data = this.source.getData(), myData = [], ma = 0;

    if (data.length < this.size) {
      return false;
    } else {
      myData = data.slice(data.length - this.size);
    }

    if (this.key) {
      myData = _.map(myData,(d) => Number(d[this.key]));
    }
    ma = this.calculateMA(myData);
    this.data.push(ma);
    this.onUpdate(ma);
  }

  /**********************************************
   * @function calculateHistoricalMA()
   * calculates the moving average of the
   * source DataProvider if it contains enough
   * historical data at load time
   ***********************************************/

  calculateHistoricalMA() {
    let data = this.source.getData(), myData = [], ma = 0, index = 0;

    if (data.length >= this.size) {

      if (this.key) {
	myData = _.map(data, (d) => Number(d[this.key]));
      } else {
	myData = data;
      }

      for(index = this.size; index <= myData.length; index++) {
	ma = this.calculateMA(myData.slice(index - this.size, index));
	this.data.push(ma);
      }

    } else {
      return false;
    }
  }

  /*********************************************
   * @function calculateMA()
   * @param data (Array)
   * returns the moving average of given array
   *********************************************/

  calculateMA(data) {
    let total = 0, avg = 0;
    total = _.reduce(data,(sum, n) => sum + n);
    avg = total / this.size;
    return avg;
  }

}

module.exports = MovingAverage;
