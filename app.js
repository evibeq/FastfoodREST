const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');

const app = express();

const fs = require("fs");

var port = process.env.PORT || 3000;

// Middleware per parsing del body delle request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(fileUpload());
app.use(express.static('public'));

// JS per la gestione delle routes
const routes = require("./routes/routes.js")(app, fs);

// Lanciamo il server
const server = app.listen(port, () => {
  console.log("Server in ascolto sulla porta %s...", server.address().port);
});
