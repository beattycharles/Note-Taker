// Required
const fs = require("fs");
const express = require("express");
const path = require("path");
const notes = require('./db/db.json')
const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 3001;
const app = express();

// MiddleWare
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// GET
app.get("/api/notes", (req, res) => {
  res.send(notes);
  console.info(`${req.method} has been received`);
});

// POST
app.post("/api/notes", (req, res) => {
  res.json(`${req.method} has been received`);
  console.info(`${req.method} has been received`);
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };
    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNote);
        fs.writeFile(
          "./db/db.json",
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) => (writeErr ? console.error(writeErr) : res.send())
        );
      }
    });
  } else {
    res.status(500).json("Error in adding notes");
  }
});

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