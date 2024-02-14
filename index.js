const express = require("express");
const app = express();
const data = require("./data.json");
const PORT = 3000;
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

//console.log(uuidv4());

const notes = data.notes;
//console.log(notes);

//body parser

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Note Server");
});

app.get("/notes", (req, res) => {
  res.json(notes);
});

app.get("/notes/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    //console.log(typeof id);
    const notesFind = notes.find((items) => items.id === id);
    //console.log(notesFind);
    res.json(notesFind);
  } catch (error) {
    console.error("Connot find data", error);
  }
});

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

//post request - why can't I post
app.post("/notes", (req, res) => {
  const note = req.body;
  console.log(note);

  const noteObj = {
    id: generateId(),
    content: note.content,
    important: Boolean(note.important) || false,
  };
  try {
    //console.log(noteObj);
    notes.push(noteObj);
    fs.writeFile("./data.json", JSON.stringify({ notes }), (err) => {
      if (err) {
        console.error("Error writing to file:", err);
        res.status(500).send("Error saving note to file");
      } else {
        console.log("Note saved successfully");
        res.json(noteObj);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

//delete request
app.delete("/notes/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const notes = data.notes.filter((items) => items.id === id);
    res.status(204).end();
  } catch (error) {
    console.error(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server 🚀 listening on ${PORT}`);
});
