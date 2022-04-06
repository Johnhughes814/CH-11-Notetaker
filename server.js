const express = require("express");
const fs = require("fs");
const path = require("path");
const database = require("./db/db")

// This sets up the Express App
var app = express();
// process.env.PORT can be used either by our local .env variables if setup with DOTENV module (import in package.json)  
var PORT = process.env.PORT || 3000;

// This is a link to my assets!
app.use(express.static('public'));
// This parses data coming in
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Routes to GET to indexedDB.html and notes/html
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Notes html and it's "url"
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
})

// CRUD API ROUTES

// Since the GET and POST functions grab from the same route, we can set it once up here.
app.route("/api/notes")
    // Grab the notes list (this should be updated for every new note and deleted note.)
    .get(function (req, res) {
        res.json(database);
    })

    // Add a new note to the json db file.
    .post(function (req, res) {
        let jsonFilePath = path.join(__dirname, "/db/db.json");
        let newNote = req.body;

        // This allows the test note to be the original note.
        let highestId = 99;
        // This loops through the array and finds the highest ID.
        for (let i = 0; i < database.length; i++) {
            let individualNote = database[i];

            if (individualNote.id > highestId) {
                // highestId will always be the highest numbered id in the notesArray.
                highestId = individualNote.id;
            }
        }
        // This assigns an ID to the newNote. 
        newNote.id = highestId + 1;
        // We push it to db.json.
        database.push(newNote)

        // Write the db.json file again.
        fs.writeFile(jsonFilePath, JSON.stringify(database), function (err) {

            if (err) {
                return console.log(err);
            }
            console.log("Your note was saved!");
        });
        // Gives back the response, which is the user's new note. 
        res.json(newNote);
    });

// We need id (not location in array to splice)
    // This route is dependent on ID of note.
    //      1. Find note by id via a loop
    //      2. Splice note out of array of notes.
    //      3. Re-write db.json, just without that newly deleted note.
    //=================================================================
 
        app.delete("/api/notes/:id", function (req, res) {
            let jsonFilePath = path.join(__dirname, "/db/db.json");
            // request to delete note by id.
            for (let i = 0; i < database.length; i++) {
        
                if (database[i].id == req.params.id) {
                    // Splice takes i position, and then deletes the 1 note.
                    database.splice(i, 1);
                    break;
                }
            }
            // Write the db.json file again.
            fs.writeFileSync(jsonFilePath, JSON.stringify(database), function (err) {
        
                if (err) {
                    return console.log(err);
                } else {
                    console.log("Your note was deleted!");
                }
            });
            res.json(database);
        });



//===========================================================================
// Listening is the last thing Express should do. This sets up the server.
//===========================================================================
app.listen(PORT, function () {
    console.log("App listening on http://localhost:" + PORT);
});