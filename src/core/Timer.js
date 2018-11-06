/************************************************
 * @class Timer
 * Convenient way to create setInterval
 * functions and keep track of their metadata
 ************************************************/

class Timer {

  constructor(options) {
    this.name = options.name || 'Timer';
    this.speed = options.speed || 1000;
    this.interval = false;
    this.tick = 0;
    this.customTick = options.onTick;
    this.customComplete = options.onComplete;
    this.isStarted = false;
    this.maxTicks = options.maxTicks;
    this.stopCondition = options.stopCondition;
  }

  /*******************************************
   * @function throwError()
   * @param msg "string"
   * throws a DataProviderError with message
   *******************************************/

  throwError(msg) {
    throw new Error(`${this.name} ${msg}`);
  }

  /*******************************************
   * function onTick()
   * hook function bound to each tick update
   ********************************************/

   onTick() {
     this.tick++;
     if (this.maxTicks && (this.tick >= this.maxTicks)) {
      this.onComplete();
     }
     if (this.customTick) {
       this.customTick();
     }
     if (this.stopCondition && this.stopCondition()) {
      this.onComplete();
     }
   }

  /***************************************************
   * @function onComplete()
   * function invoked when transition is completed
   ***************************************************/

  onComplete() {
    this.isStarted = false;
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (this.customComplete) this.customComplete();
  }

  /*****************************************
   * @function start()
   * Begins the timer onTick() execution
   ****************************************/

  start() {
    if (!this.isStarted) {
      this.isStarted = true;
      this.onTick();
      this.interval = setInterval(() => {
	this.onTick();
      }, this.speed);
    }
  }

  /******************************************
   * @function stop()
   * Clears the interval and stops execution
   ******************************************/

  stop() {
    this.onComplete();
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
    if (this.isStarted) {
      this.throwError('Cannot add event listener after the timer has started');
    }
    switch(event) {
      case 'update':
      case 'tick':
	this.customTick = callback;
	break;
      case 'complete':
	this.customComplete = callback;
	break;
      case 'stopcondition':
	this.stopCondition = callback;
	break;
      default:
	break;
    }
  }

  /***********
   * Getters
   ***********/

  getTicker() {
    return this.tick;
  }

  getName() {
    return this.name;
  }

}

module.exports = Timer;
