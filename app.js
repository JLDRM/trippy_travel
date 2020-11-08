const express = require('express');
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./src/hall-of-fame/schema/schema");

const app = express();

mongoose.connect(
  "mongodb+srv://Crocubot:DontBeRude@spicy-boy-stays-hot.bquzt.mongodb.net/trippy-travel-hall-of-fame?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
mongoose.connection.once("open", () => {
  console.log("...connected to the database");
});

// Middleware to handle graphql calls
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

// Serve all the static files form the root directory
app.use(express.static(__dirname + '/src/'));

// Fallback for all request
app.get('/*', function (req, res) {

  res.sendFile(__dirname + '/src/landing.html');

});

app.listen(process.env.PORT || 8080, () => {
  console.log("...listening on port 8080");
});