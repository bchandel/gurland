const express = require('express'),
  app = express(),
  config = require('./config/config.json'),
  port = config.port || 8000,
  bodyParser = require('body-parser'),
  routes = require('./api'),
  setupDb = require('./config/database');

// Parse incoming json requests to req.body object
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use((request, response, next) => {
  allowCrossDomain(request, response, next);
});

const envConfig = config[config.env];
// console.log("envConfig ******",envConfig);

app.use((request, response, next) => {
  request.dbPath = envConfig.mongoURL + envConfig.dbName;
  console.log("request.dbPath",request.dbPath);
  setupDb.getDBConnection(request, response, next);
});

app.get('/api', (request, response) => {
  response.send('Gurland API Server - Hello World!');
});

var allowCrossDomain = function(req, res, next) {
  var allowedOrigins = config.allowCors.urls;
  var origin = req.headers.origin;

  if (allowedOrigins.indexOf(origin) > -1 || allowedOrigins.indexOf('*') > -1) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', config.allowCors.methods);
  res.header('Access-Control-Allow-Headers', config.allowCors.headers);

  // Need to immediately return the options method with 200 ok response
  if ('OPTIONS' === req.method) {
    return res.sendStatus(200);
  } else {
    next();
  }
};

app.use(express.static('public'));

// Catch errors in Middlewares
app.use((err, request, response, next) => {
  response.status(500).send('Internal Server Error');
});

routes.gurlandRoutes(app);

app.listen(port, err => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log('Gurland API Server is listening on %s', port);
});

module.exports = app;
