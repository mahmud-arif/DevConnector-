const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const errorHandlers = require('./Handaler/errorHandaler');

const app = express();

require('dotenv').config({
  path: 'variable.env',
});

app.use(cors());
// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./service/passport');

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
  })
  .then(result => console.log('connect successfully'))
  .catch(err => console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`));

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);
// One of our error handlers will see if these errors are just validation errors
// app.use(errorHandlers.flashValidationErrors);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
