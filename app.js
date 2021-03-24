'use strict';

require('dotenv').config();
const express = require('express');
const catRouter = require('./routes/catRoute');
const userRouter = require('./routes/userRoute');
const db = require('./db');

const app = express();
app.use(express.json());
const port = 3000;

db.on('connected', () => {
  app.listen(port, () => console.log(`Express server listening on port ${port}!`))
});

app.use('/cat', catRouter);
app.use('/user', userRouter);
