const express = require("express");
const fs = require("fs");
const path = require("path");
const database = require("./db/db")

// This sets up the Express App
var app = express();
// process.env.PORT can be used either by our local .env variables if setup with DOTENV module (import in package.json)  
var PORT = process.env.PORT || 3000;





//===========================================================================
// Listening is the last thing Express should do. This sets up the server.
//===========================================================================
app.listen(PORT, function () {
    console.log("App listening on http://localhost:" + PORT);
});