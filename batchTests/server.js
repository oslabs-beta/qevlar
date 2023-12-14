// import express from 'express';
const express = require('express');
const { expressGraphQL, graphqlHTTP } = require('express-graphql');
const { schema } = require('./schema');
const controller = require('./midFunctions.js');
console.log('schema', schema);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(controller.batch);
// app.use(
//   '/graphql',
//   graphqlHTTP({
//     schema: schema,
//     graphiql: true,
//   })
// );

app.use(
  '/graphql',
  graphqlHTTP((req, res) => {
    const query = res.locals.q;
    console.log('query', query);
    console.log('schema', schema);
    return {
      schema: schema,
    };
  })
);

// app.post('/graphql', controller.batch, (req, res) => {
//   console.log('req', req);
//   console.log('woo');
//   res.status(200).json({ message: 'Received the POST request successfully.' });
// });

app.listen(3000, () => console.log('listening on 3000'));
