'use strict';

require('dotenv').config();
const express = require('express');
const stationRouter = require('./stationRoutes');
const db = require('./db');

const app = express();
app.use(express.json());
const port = 3000;

db.on('connected', () => {
  app.listen(port, () => console.log(`Express server listening on port ${port}!`))
});

app.use('/station', stationRouter);
