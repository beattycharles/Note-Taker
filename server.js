// Required
const fs = require("fs");
const express = require("express");
const path = require("path");
let notes = require("./db/db.json");
const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 3001;
const app = express();

// MiddleWare
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// GET
app.get("/api/notes", (req, res) => {
   fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        res.json(err)
      } else {
        const parsedNotes = JSON.parse(data);
        console.info(`${req.method} has been received`);
        notes = parsedNotes
        res.json(parsedNotes);
      }
    })

});

// POST
app.post("/api/notes", (req, res) => {
// res.json(`${req.method} has been received`);
  console.info(`${req.method} has been received`);
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };
    //put read and write into there own func.
    // fs.readFile("./db/db.json", "utf8", (err, data) => {
    //   if (err) {
    //     console.error(err);
    //   } else {
    //     const parsedNotes = JSON.parse(data);
        notes.push(newNote);
        fs.writeFile(
          "./db/db.json",
          JSON.stringify(notes, null, 4),
          (writeErr) => (writeErr ? res.json(err) : res.json(notes))
        );
       // res.json(parsedNotes)
      //}
   // });
  } else {
    res.status(500).json("Error in adding notes");
  }
});
app.delete("/api/notes/:id",(req,res) => {
  let notbeingReadded = []
  for (let i = 0; i < notes.length; i++) {
    if ( notes[i].id != req.params.id){
      notbeingReadded.push(notes[i])
    }
    
  }
  notes = notbeingReadded
   fs.writeFile("./db/db.json", JSON.stringify(notes, null, 4), (writeErr) =>
     writeErr ? res.json(err) : res.json(notes)
   );
})

//redirects to either index or notes
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/notes.html"))
);

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/index.html"))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
