const { ApolloServer, AuthenticationError } = require('apollo-server-express');
const express = require('express');
const { createServer } = require('http');
const typeDefs = require('./schemas');

const dataSources = require('./dataSources');

const { verifyToken } = dataSources.redisUtils;
const resolvers = require('./resolvers');
const { checkQuery, createDataLoader } = require('./utils');

const { io } = require('./socket');

// const { redisUtils } = require('./dataSources');
const app = express();
const httpServer = createServer(app);
io.attach(httpServer);

app.get('/chat', (req, res) => {
  res.sendFile(`${__dirname}/socket/client.html`);
});

async function createContext({ req }) {
  const { isPass, isLogout } = checkQuery(req.body.query);
  if (isPass) return { dataLoader: createDataLoader() };

  const token = req.headers.authorization.replace('bearer ', '');
  const verifyResult = await verifyToken(token);
  if (!verifyResult.isSuccess) {
    throw new AuthenticationError(verifyResult.message);
  }
  const dataContext = {
    signature: verifyResult.signature,
    dataLoader: createDataLoader(),
  };

  // Logout
  if (isLogout) {
    dataContext.token = token;
  }

  return dataContext;
}

(async function createApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: dataSources.controllers,
    context: createContext,
    introspection: true,
  });

  await server.start();

  server.applyMiddleware({
    app,
  });
}());

module.exports = httpServer;
