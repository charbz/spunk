const DataProvider = require('../core/DataProvider');

/**********************************************
 * @class ArrayProvider
 * @implements DataProvider
 * A basic DataProvider for Array objects.
 * Provides methods to normalize, add, update
 * elements uniformly and acts as a SSOT
 **********************************************/

class ArrayProvider extends DataProvider {

  constructor(options) {
    options.name = options.name || 'ArrayProvider';
    options.source = 'local';
    super(options);
    this.initialData = options.data || [];
    if (!Array.isArray(this.initialData)) {
      this.throwError('must be initialized with data as array');
    }
    this.load();
  }


  /*******************************************
   * @function load()
   * subclasses must implement load function
   *******************************************/

  load() {
    this.data = this.normalize(this.initialData);
    this.onLoad();
  }


  /******************************************
   * @function add()
   * @param element
   * implements how each datapoint is added
   ******************************************/

  add(element) {
    this.data.push(element);
    this.onUpdate(element);
  }


  /*************************************
   * @function init()
   * function override to avoid misuse
   *************************************/

  init() {
    return true;
  }

}

module.exports = ArrayProvider;
