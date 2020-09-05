// load up the express framework and body-parser helper
const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');

// create an instance of express to serve our end points
const app = express();

// we'll load up node's built in file system helper library here
// (we'll be using this later to serve our JSON files
const fs = require("fs");

//Heroku Port
var port = process.env.PORT || 3000;

// configure our express instance with some body-parser settings
// including handling JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(fileUpload());
app.use(express.static('images'));

// this is where we'll handle our various routes from
const routes = require("./routes/routes.js")(app, fs);

// finally, launch our server on port setted by heroku.
const server = app.listen(port, () => {
  console.log("Sto ad ascolta' sulla porta %s...", server.address().port);
});
