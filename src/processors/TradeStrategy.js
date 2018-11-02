/**********************************************************
 * @class TradingStrategySimulator
 * High level processor that simulates a trading
 * strategy. provides some common utilities like buy, sell
 * buyMax, sellMax, getAssets .. etc
 *
 * must be instanciated with an assets object that
 * define assets as follows:
 * "ASSET_NAME": {
 *     "price": 10
 *     "balance": 1
 *  }...
 *
 * must also be instanciated with a baseAsset property
 * which is a string denoting the base asset (ex "USD")
 *
 * subclasses must implement the trade() function taking
 * input data and making a decision based on the input
 *********************************************************/

const Processor = require('../core/Processor');

class TradingStrategySimulator extends Processor {

  constructor(options) {
    options = options || {};
    super(options);
    this.assets = options.assets;
    this.baseAsset = options.baseAsset;
    this.customSell = options.onSell || false;
    this.customBuy = options.onBuy || false;
    if (typeof options.assets === "undefined")
      this.throwError("Must contain assets object");
    if (typeof options.baseAsset === "undefined")
      this.throwError("Must specify baseAsset string");
  }

  /***********************************
   * @function throwError()
   * @param msg "string"
   * throws an Error with message
   **********************************/

  throwError(msg) {
    throw new Error(`${this.name} ${msg}`);
  }

  /************************************************
   * @function buy()
   * @param asset (string)
   * @param amount (Number)
   * @param fee (Number) Optional
   * buys a specific amount of the specified asset
   ************************************************/

  buy(asset, amount, fee) {
    let txfee = 0;
    if (!isNaN(fee)) {
      txfee += fee;
    }
    let base = this.assets[this.baseAsset];
    let target = this.assets[asset];
    let cost = amount * target.price;
    cost += txfee;
    if (cost > base.balance) {
      console.log("Insufficient funds");
      return false;
    } else {
      base.balance -= cost;
      target.balance += amount;
    }
    this.onBuy();
  }

  /******************************************************
   * @function buyMax()
   * @param asset (string)
   * @param fee (Number) Optional
   * buys maximum amount possible of the specified asset
   ******************************************************/

  buyMax(asset, fee) {
    let txfee = 0;
    if (!isNaN(fee)) {
      txfee += fee;
    }
    let base = this.assets[this.baseAsset];
    let target = this.assets[asset];
    let amount = (base.balance - txfee) / target.price;
    target.balance += amount;
    base.balance = 0;
    this.onBuy();
  }

  /************************************************
   * @function sell()
   * @param asset (string)
   * @param amount (Number)
   * @param fee (Number) Optional
   * sells a specific amount of the specified asset
   ************************************************/

  sell(asset, amount, fee) {
     let txfee = 0;
     if (!isNaN(fee)) {
       txfee += fee;
     }
     let base = this.assets[this.baseAsset];
     let target = this.assets[asset];
     let value;
     if (asset == this.baseAsset || target.balance == 0) {
       console.log("Nothing to sell");
       return false;
     }
     else if (target.balance < amount) {
       console.log("Sell order amount is higher than balance");
       return false
     } else {
        value = (amount * target.price) - txfee;
        base.balance += value;
        target.balance -= amount;
        this.onSell();
     }
  }

  /********************************************************
   * @function sellMax()
   * @param asset (string)
   * @param fee (Number) Optional
   * sells maximum amount possible of the specified asset
   ********************************************************/

  sellMax(asset, fee) {
    let txfee = 0;
    if (!isNaN(fee)) {
      txfee += fee;
    }
    let base = this.assets[this.baseAsset];
    let target = this.assets[asset];
    let value;
    if (asset == this.baseAsset || target.balance == 0) {
      console.log("Nothing to sell");
      return false;
    }
    else {
      value = (target.balance * target.price) - txfee;
      base.balance += value;
      target.balance = 0;
      this.onSell();
    }
  }

  /************
   * Getters
   ************/

  getAssets() {
    return this.assets;
  }

  getBaseAsset() {
    return this.baseAsset;
  }

  getAssetValue(asset) {
    let target = this.assets[asset];
    if (typeof target === "undefined") {
      this.throwError("Asset does not exist");
    }
    return target.balance * target.price;
  }

  /************
   * Setters
   ************/

  setPrice(asset, price) {
    if (typeof this.assets[asset] !== "undefined")
      this.assets[asset].price = price;
  }

  /***********
   * Events
   ***********/

  onBuy() {
    if (this.customBuy) {
      this.customBuy();
    }
  }

  onSell() {
    if (this.customSell) {
      this.customSell();
    }
  }

  /*********************************************************
   * @function trade() Abstract
   * must be implemented by subclasses. it takes input data
   * then decides how to act on that data (buy, sell, hold)
   *********************************************************/

  trade() {
    this.throwError("Trade must be implemented by subclass");
  }

}

module.exports = TradingStrategySimulator;
