/********************************************
 * @class DataProvider
 * defines methods to fetch and normalize
 * data points from several resources and
 * pass the mutated data to a processor
 ********************************************/

class DataProvider {


  constructor(options) {
    this.data = [];
    this.source = options.source;
    this.name = options.name || 'DataProvider';
    this.customUpdate = options.onUpdate ? [options.onUpdate] : [];
    this.customLoad = options.onLoad ? [options.onLoad] : [];
    this.isInitialized = false;
    if (typeof this.source === "undefined") {
      this.throwError('must be instantiated with source property');
    }
  }


  /*******************************************
   * @function throwError()
   * @param msg "string"
   * throws a DataProviderError with message
   *******************************************/

  throwError(msg) {
    throw new Error(`${this.name} ${msg}`);
  }


  /*************************************************
   * @function load() [Abstract]
   * defines how data is first loaded from sources
   * every sub-class must implement this method
   **************************************************/

  load() {
    this.throwError('method load() must be implemented');
  }


  /**************************************************
   * @function validate()
   * defines how a data-point should be validated
   * before it is added to the existing data-set.
   * subclasses should ensure the data-point conforms
   * to the structure of data-set elements
   ***************************************************/

  validate(datapoint) {
    return datapoint;
  }


  /****************************************************
   * @function add()
   * defines how each new data-point is added
   * to the data-set. must be implemented by subclass
   ****************************************************/

  add(data) {
    this.throwError('add() method must be implemented by subclass');
  }


  /***********************************************
   * @function normalize() ::optional::
   * @param dataset
   * @returns dataset
   * defines how a data set should be normalized
   * after it has been loaded. this acts like a
   * hook for data transformation after load
   ***********************************************/

  normalize(dataset) {
    return dataset;
  }


  /**********************************************
   * @function init()
   * Load and normalize the data in sources.
   **********************************************/

  init() {
    const promised = this.load();
    const response = (data) => {
      this.data = this.normalize(data);
      this.onLoad();
      return new Promise((resolve) => { resolve(this.data) });
    };

    if (promised.then && typeof promised.then === 'function') {
      return promised.then(response);
    } else {
      return response.call(this, promised);
    }

  }


  /*****************************************
  * @function onLoad()
  * function triggered when DataProvider
  * is initialized and the data is loaded
  ******************************************/

  onLoad() {
    this.isInitialized = true;
    if (this.customLoad.length > 0) {
      for (let cb of this.customLoad) {
	cb(this.data);
      }
    }
  }

  onUpdate(update) {
    if (this.customUpdate.length > 0) {
      for (let cb of this.customUpdate) {
	cb(update);
      }
    }
  }

  /*******************************************
  * @function addEventListener()
  * @param event (String) 'update' or 'load'
  * @param callback (Function)
  ********************************************/

  addEventListener(event, callback) {
    if (typeof event === 'undefined' || typeof callback !== 'function') {
      this.throwError('addEventListener expects an event and callback parameter');
    }
    switch(event) {
      case 'update':
	this.customUpdate.push(callback);
	break;
      case 'load':
	this.customLoad.push(callback);
	break;
      default:
	break;
    }
  }

  /*******************************************
  * @function removeEventListener()
  * @param event (String) 'update' or 'load'
  * @param callback (Function)
  ********************************************/

  removeEventListener(event, callback) {
    let index;
    if (typeof event === 'undefined' || typeof callback !== 'function') {
      this.throwError('removeEventListener expects an event and callback parameter');
    }
    switch(event) {
      case 'update':
	index = this.customUpdate.indexOf(callback);
	if (index > -1) {
	  this.customUpdate.splice(index,1);
	}
	break;
      case 'load':
	index = this.customLoad.indexOf(callback);
	if (index > -1) {
	  this.customLoad.splice(index,1);
	}
	break;
      default:
	break;
    }
  }

  /************
   * Getters
   ************/

  getData() {
    return this.data;
  }

  getDatum(index) {
    return this.data[index];
  }

  getLast() {
    return this.data[this.data.length - 1];
  }

  getSource() {
    return this.source;
  }

  isInitialized() {
    return this.isInitialized;
  }

  /************************************************
   * Setters
   * Todo: restrict the setters to Transitioners
   ************************************************/

  setData(data) {
    this.data = data;
    this.onUpdate(data);
  }

  setDatum(index, datum) {
    this.data[index] = datum;
    this.onUpdate(datum);
  }


  /***********************************************
   * @function deepCopy()
   * returns a copy of this DataProvider's data
   ***********************************************/

  deepCopy() {
    let output, v, key, data = this.data;
    output = Array.isArray(data) ? [] : {};
    for (key in data) {
      v = data[key];
      output[key] = (typeof v === "object") ? copy(v) : v;
    }
    return output;
  }

  /******************************************
   * @function reverse()
   * Reverses the order of loaded elements
   ******************************************/

  reverse() {
    if (Array.isArray(this.data)) {
      this.data.reverse();
    }
  }

}

module.exports = DataProvider;
