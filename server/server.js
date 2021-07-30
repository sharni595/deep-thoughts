const express = require('express');
//import Apollo Server
const { ApolloServer } = require('apollo-server-express');

//import typedefs and resolvers
const  { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();
//create new apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

//integrate apollo server with express application as middleware
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    //log where we can go to test our gql api
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
