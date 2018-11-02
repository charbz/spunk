/*****************************************************
 * @class Transitioner
 * Iterates through a data-set either at a specified
 * speed or immediately and applies modifications
 *****************************************************/

const _ = require('lodash');
const DataProvider = require('./DataProvider');
const Processor = require('./Processor');

class Transitioner {

  constructor(options) {
    this.name = options.name || 'Transitioner';
    this.map = options.map;
    this.speed = options.speed || false;
    this.interval = false;
    this.tick = 0;
    this.validate();
    this.completedJobs = _.fill(Array(this.map.length), 0);
    this.customTick = options.onTick;
    this.customComplete = options.onComplete;
  }

  /*******************************************
   * @function throwError()
   * @param msg "string"
   * throws a TransitionerError with message
   *******************************************/

  throwError(msg) {
    throw new Error(`${this.name} ${msg}`);
  }

  /*******************************************
   * @function validate()
   * makes sure that this.map is an Array
   * of [{DataProvider:Processor}] instances
   *******************************************/

  validate() {
    let provider, modifiers, modifier;

    if (this.speed && isNaN(this.speed))
      this.throwError('speed must be a number in milliseconds');

    if (!this.map)
      this.throwError('map must be defined');

    if (!Array.isArray(this.map))
      this.throwError('map must be an array of [ [DataProviderInstance, ProcessorInstance, ... ], ...]');

    if (this.map.length === 0)
      this.throwError('map Array must contain at least one element');

    for(let pair of this.map) {
      provider = pair[0];
      modifiers = pair.slice(1);
      if (!(provider instanceof DataProvider))
	this.throwError(`${provider} is not an instance of DataProvider`);
      for (modifier of modifiers) {
	if (!(modifier instanceof Processor) && !(typeof modifier === 'function'))
	  this.throwError(`${modifier} must be a function or an instance of Modifier`);
      }
    }
  }

  /*******************************************
   * function onTick()
   * hook function bound to each tick update
   ********************************************/

   onTick() {
     if (this.customTick) this.customTick();
   }

  /***************************************************
   * @function onComplete()
   * function invoked when transition is completed
   ***************************************************/

  onComplete() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (this.customComplete) this.customComplete();
  }

  /***************************************************
   * @function start()
   * iterates over elements and applies modifications
   ***************************************************/

  start() {
    if (!this.speed) {
      this.execute()
    } else {
      this.executeIntervals()
    }
  }

  /********************************************************
   * @function execute()
   * iterates over each pair of Provider/Processor
   * and applies to mutation to all elements from provider
   ********************************************************/

  execute() {
    let provider;
    let modifier;
    let modifiers;
    let data;
    for (let pair of this.map) {
      provider = pair[0];
      modifiers = pair.slice(1);
      data = provider.getData();
      for (modifier of modifiers) {
	if (modifier.constructor.prototype.hasOwnProperty('applyAll')) {
	  data = modifier.applyAll(data)
	} else if (modifier instanceof Processor) {
	  data = _.map(data, modifier.apply);
	} else {
	  data = _.map(data, modifier);
	}
      }
      provider.setData(data);
    }
    this.onComplete();
  }

  /**********************************************************
   * @function executeIntervals()
   * On each interval, this function applies the mutation
   * to one data point from every provider. When a provider
   * no longer has data points, it adds a completed flag
   * for it in this.completedJobs. when all jobs are
   * completed it fires this.onComplete()
   **********************************************************/

  executeIntervals() {
    this.interval = setInterval(() => {
      let data;
      let provider;
      let modifier;
      let modifiers;
      let pair;
      let jobsDone = 0;
      let datum;
      for (let i=0; i < this.map.length; i++) {
	pair = this.map[i];
	provider = pair[0];
	modifiers = pair.slice(1);
	data = provider.getData();
	if (this.tick < data.length) {
	  datum = data[this.tick];
	  for (modifier of modifiers) {
	    if (modifier instanceof Processor) {
	      datum = modifier.apply(datum);
	    } else {
	      datum = modifier(datum);
	    }
	  }
	  provider.setDatum(this.tick, datum);
	} else {
	  this.completedJobs[i] = 1;
	}
	jobsDone = _.reduce(this.completedJobs, (sum, n) => { return sum + n; }, 0);
	if (jobsDone === this.map.length) {
	  this.onComplete();
	}
      }
      this.tick++;
      this.onTick();
    },this.speed);
  }

}

module.exports = Transitioner;
