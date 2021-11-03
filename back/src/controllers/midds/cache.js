const chalk = require('chalk');
const db = require('../index');


function makeKey(req) {
  return `${req.method}_${req.baseUrl}`;
}

function cache(req, res, next) {
  const client = db.getModel('Redis');

  // arma key con pedido y token
  const key = makeKey(req);
  console.log(chalk.greenBright(`get ${key}`));

  try {
    // recupera cache
    client.get(key, (error, data) => {
      if (error || !data) {
        next();
      } else {
        const jsonValue = JSON.parse(data);
        console.log(chalk.greenBright(`CACHE ${key}`));
        res
        .status(200)
        .json(jsonValue);
      }
    });
  } catch (error) {
    console.log(chalk.redBright(`Get ${error}`));
    next();
  }
}

function storeObjectInCache(req, value) {
  const client = db.getModel('Redis');

  const key = makeKey(req);
  const jsonValue = JSON.stringify(value);

  try {
    console.log(chalk.greenBright(`STORE ${key} ${jsonValue}`));
    client.set(key, jsonValue);
  } catch (error) {
    console.log(chalk.redBright(`Store ${error}`));
  }
}

function invalidateCache(req) {
  const client = db.getModel('Redis');

  const key = makeKey(req);
  console.log(chalk.greenBright(`DEL ${key}`));

  client.DEL(key);
}

module.exports = {
  cache,
  storeObjectInCache,
  invalidateCache,
};
