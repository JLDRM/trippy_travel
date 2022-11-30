const express = require('express');
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./public/hall-of-fame/schema/schema");
require('dotenv').config();

const app = express();

const mongo_connection = process.env['MONGO_CONNECTION'];

try {
  mongoose.connect(
    mongo_connection,
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
  mongoose.connection.once("open", () => {
    console.log("...connected to the database");
  });
} catch (error) {
  console.error(error)
}

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: false
  })
  );
  
app.use(express.static('public'));

app.get('/*', function (_, res) {
  res.sendFile(__dirname + '/landing.html');
});

app.listen(process.env.PORT || 8080, () => {
  console.log("...listening on port 8080");
});

module.exports = app;
