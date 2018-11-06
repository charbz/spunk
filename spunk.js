const DataProvider = require('./src/core/DataProvider');
const Transitioner = require('./src/core/Transitioner');
const Processor = require('./src/core/Processor');
const Timer = require('./src/core/Timer');
const CSVProvider = require('./src/providers/CSVProvider');
const ArrayProvider = require('./src/providers/ArrayProvider');
const MovingAverage = require('./src/providers/MovingAverage');
const TradingStrategySimulator = require('./src/processors/TradeStrategy');
const Percentage = require('./src/utils/percentage.js');

function Spunk () {
  return {
    CSVProvider: (opt) => {
      return new CSVProvider(opt || {});
    },
    ArrayProvider: (opt) => {
      return new ArrayProvider(opt || {});
    },
    Transitioner: (opt) => {
      return new Transitioner(opt || {});
    },
    MovingAverage: (opt) => {
      return new MovingAverage(opt || {});
    },
    Timer: (opt) => {
      return new Timer(opt || {});
    },
    Utils: {
      percentage: Percentage
    },
    Constructors: {
      DataProvider: DataProvider,
      CSVProvider: CSVProvider,
      Transitioner: Transitioner,
      Processor: Processor,
      Timer: Timer,
      ArrayProvider: ArrayProvider,
      MovingAverage: MovingAverage,
      TradingStrategySimulator: TradingStrategySimulator
    }
  };
}

module.exports = Spunk();
