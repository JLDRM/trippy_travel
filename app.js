const express = require('express');
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./src/hall-of-fame/schema/schema");
require('dotenv').config();

const app = express();

const mongo_connection = process.env['MONGO_CONNECTION'];

mongoose.connect(
  mongo_connection,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
mongoose.connection.once("open", () => {
  console.log("...connected to the database");
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: false
  })
);

app.use(express.static(__dirname + '/src/'));

app.get('/*', function (req, res) {
  res.sendFile(__dirname + '/src/landing.html');
});

app.listen(process.env.PORT || 8080, () => {
  console.log("...listening on port 8080");
});