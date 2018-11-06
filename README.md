### Spunk
Spunk is a simple yet powerful data processing framework for building trading bots and simulations. It can also be used for any type of data processing application.

###Features

- Create data providers from multiple sources ( Csv, Json,  Web-Api ... etc) 
- Add event-listeners to your data providers
- Pipe your data into data processors
- Growing library of built-in providers and processors

###Installation
Spunk is only tested for server-side at the moment `npm install spunk`

###Examples

**Load data from multiple CSV files**

| CSV1.csv  | CSV2.csv  |
| ------------ | ------------ |
|date, asset, price  <br> 01-01-2018, BTC, 6000 <br> 01-02-2018, BTC, 6028 <br> ...  |  date, asset, price  <br> 01-01-2018, ETH, 199 <br> 01-02-2018, ETH,  208 <br> ...  |

```javascript
const Spunk = require('spunk');

const csv = Spunk.CSVProvider({ source: ['csv1.csv', 'csv2.csv'] });

csv.init().then(() => {
  csv.reverse();
  console.log(csv.getData());
});

/*
     Console:
     [
       { "date": "01-02-2018", "asset": "ETH", "price": 208 },
       { "date": "01-01-2018", "asset": "ETH", "price": 199 },
       { "date": "01-02-2018", "asset": "BTC", "price": 6028 },
       { "date": "01-01-2018", "asset": "BTC", "price": 6000 },
     ]
*/
```

**Add new data to your csv provider on the fly **

```javascript
...
csv.add({
  "date": "01-03-2018",
  "asset": "LTC",
  "price": 55
});

console.log(csv.getData());

/*
     Console:
     [
       { "date": "01-02-2018", "asset": "ETH", "price": 208 },
       { "date": "01-01-2018", "asset": "ETH", "price": 199 },
       { "date": "01-02-2018", "asset": "BTC", "price": 6028 },
       { "date": "01-01-2018", "asset": "BTC", "price": 6000 },
       { "date": "01-03-2018", "asset": "LTC", "price": 55 }   <------
     ]
*/

```

**Add some event listeners **

```javascript
...
csv.addEventListener('update', (data) => {
  console.log(`Added a new entry for asset: ${data.asset}`);
});

csv.add({
  "date": "01-04-2018",
  "asset": "XLM",
  "price": 0.12
});

/*
     Console:
     Added a new entry for asset: XLM
*/
```

**Create a Moving Average provider**

```javascript
const Spunk = require("../spunk");

const prices = Spunk.ArrayProvider({ data: [10,8,9,8,7] });
const MA = Spunk.MovingAverage({ source: prices, size: 5 });

MA.addEventListener('update', (data) => {
  console.log(`Current Moving Average: ${data}`);
});

prices.add(12);
/* Console:  Current Moving Average: 8.8 */

prices.add(6);
/* Console:  Current Moving Average: 8.4 */

console.log(MA.getData());
/* Console: [8.8, 8.4] */

console.log(prices.getData());
/* Console: [10, 8, 9, 8, 7, 12, 6] */
```
###Contribute

👍🎉 First off, thanks for taking the time to contribute! 🎉👍

Spunk is a living project, We would love to see all the new things you add to it.

Pull requests are the best way to propose changes to the codebase (we use Github Flow). We actively welcome your pull requests:

- Fork the repo and create your branch from master.
- If you've added code that should be tested, add tests.
- Ensure the test suite passes.
- Make sure your code lints.
- Issue that pull request!

**Some ideas for expansion:**
- Create new data providers ( Weighted moving avg , RSI, etc)
- Create new processors ( Trading strategies, Charting, CSVProducer .. etc)
- Add more features to the core classes ( DataProvider.js, Processor.js .. etc )
- Create a reference manual
- Add more unit tests

The opportunities are limitless. Any feature that has common use will be seriously considered.
