/*************************************
 * @class Processor
 * defines methods to consume data
 * and manipulate it
 ************************************/

class Processor {

  constructor(options) {
    options = options || {};
    this.name = options.name || 'DataProcessor';
    this.metaData = {};
  }

  /*******************************************
   * @function throwError()
   * @param msg "string"
   * throws a ModifierError with message
   *******************************************/

  throwError(msg) {
    throw new Error(`${this.name} ${msg}`);
  }

  /*************************************************
   * @function process() [Abstract]
   * @param datum
   * defines data transformation on one data point
   **************************************************/

  process(datum) {
    this.throwError('method process() must be implemented');
  }

  /*************************************************
   * @function processAll()
   * @param dataset
   * defines data transformation on dataset
   **************************************************/

  processAll(dataset) {
    this.throwError('method processAll() must be implemented');
  }

}

module.exports = Processor;
