const chalk = require('chalk');
const { initialize } = require('./config/initialize');
const { config } = require('dotenv');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const path = require('path');
const helmet = require('helmet');
const { connect, redisConn } = require('./model');
const { makeServer } = require('./server');

async function main() {
  // variables entorno
  config();
  const {
    MYSQL_USER,
    MYSQL_PASS,
    MYSQL_DATABASE,
    MYSQL_PORT,
    MYSQL_HOST,
    REDIS_HOST,
    REDIS_PORT,
  } = process.env;

  // express
  const PORT = process.env.EXPRESS_PORT || 5050;
  const server = makeServer();
  server.listen(PORT, () => global.console.log(chalk.cyan(`Server running ${PORT}`)));
  server.set('views', './views');
  server.set('view engine', 'pug');

  // Swagger
  const controllersFolder = path.join(__dirname, './controllers/routers/*.js');
  const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: 'Delilah Restó API',
        version: '2.0.0',
        description: 'by Gonzalo Parra',
      },
      securityDefinitions: {
        Bearer: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
        },
      }
    },
    apis: [controllersFolder],
  };
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  server.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

  // helmet
  server.use(helmet());

  // database
  await connect(MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASS, MYSQL_DATABASE);
  //initialize();

  // redis
  redisConn(REDIS_HOST, REDIS_PORT);
}

main();
