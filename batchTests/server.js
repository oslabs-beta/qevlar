//import node dependencies
const https = require('http');
const fs = require('fs');
const path = require('path');
const schema = require('./schema');
//import graphql dependencies
const {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require('graphql');
//initialize server
// const options = {
//   port: 3000,
//   path: '/graphql',
// };

const server = https.createServer();

server.on('request', (req, res) => {
  console.log('req', req);
  console.log('hello');
  let body = '';

  req.on('data', (chunk) => (body += chunk.toString()));

  console.log('req', req);

  console.log('body', body);
});

server.listen(3000, () => console.log('listening on 3000'));
