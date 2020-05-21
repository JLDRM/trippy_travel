const express = require('express')
const app = express();

// Serve all the static files form the root directory
app.use(express.static(__dirname + '/src/'));

// Fallback for all request
app.get('/*', function(req,res) {
    
res.sendFile(__dirname + '/src/landing.html');

});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);