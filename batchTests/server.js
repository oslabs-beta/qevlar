// import express from 'express';
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { schema } = require('./schema.js');
const controller = require('./midFunctions.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.post('/graphql', controller.batch, (req, res) => {
  console.log('req', req);
  console.log('woo');
  res.status(200).json({ message: 'Received the POST request successfully.' });
});

app.listen(3000, () => console.log('listening on 3000'));
