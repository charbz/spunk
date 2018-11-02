const DataProvider = require('../core/DataProvider');
const CSV = require('csvtojson');
const _ = require('lodash');

/********************************************
 * @class CSVProvider
 * @implements DataProvider
 * load one or more CSV files and normalize
 * its data.
 ********************************************/

class CSVProvider extends DataProvider {

  constructor(options) {
    options.name = options.name || 'CSVProvider';
    super(options);
  }


  /*************************************************
   * @function load
   * reads one or more CSV files asynchronously
   * then returns the promised data as json arrays
   *************************************************/

  async load() {
    const files = Array.isArray(this.source) ? this.source : [this.source];
    let promisedData = files.map(async(value) => {
      const result = await CSV().fromFile(value);
      return result;
    });
    return await Promise.all(promisedData);
  }


  /******************************************
   * @function add()
   * @param element
   * implements how each datapoint is added
   ******************************************/

  add(element) {
    let toBeAdded = element;
    if (Array.isArray(toBeAdded)) {
      toBeAdded = this.normalize(toBeAdded);
      this.data.push(toBeAdded);
    } else {
      this.data.push(toBeAdded);
    }
    this.onUpdate(toBeAdded);
  }


  /*************************************
   * @function normalize
   * @param dataset
   * @returns dataset
   * Flattens the CSV arrays into one
   *************************************/

  normalize(items) {
    return _.flatten(items);
  }

}

module.exports = CSVProvider;
