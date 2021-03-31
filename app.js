'use strict';

require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const stationRouter = require('./stationRoutes');
const db = require('./db');

const app = express();
app.use(express.json());
const port = 3000;

app.use('/graphql', graphqlHTTP({ schema, graphiql: true }));


db.on('connected', () => {
  app.listen(port, () => console.log(`Express server listening on port ${port}!`))
});

app.use('/station', stationRouter);
