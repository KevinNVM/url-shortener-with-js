const express = require("express");
const validUrl = require("valid-url");
const { writeFileSync, readFileSync } = require("fs");

const { generateUid } = require("./utils");

const app = express();
const URL = "http://localhost:3000/";
const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/short", (req, res) => {
  const { url } = req.body;

  if (!url || !validUrl.isUri(url)) {
    res.send({
      message: "Url is invalid!",
      status: false,
    });
  }

  const newData = {
    origin: url,
    uid: generateUid(),
  };

  const oldData = JSON.parse(readFileSync("./db.json", "utf-8"));

  const dataToStore = [...oldData, newData];

  writeFileSync("./db.json", JSON.stringify(dataToStore));

  res.json({
    message: "Success!",
    ...newData,
    link: URL + newData.uid,
  });
});

app.get("/:uid", (req, res) => {
  const { uid } = req.params;

  if (!uid) {
    res.send({
      message: "Link is not found!",
      status: 404,
    });
  }

  const data = JSON.parse(readFileSync("./db.json", "utf-8"));

  const findData = data.find((url) => url.uid === uid);

  if (findData && findData.uid) {
    res.redirect(findData.origin);
  } else {
    res.send({
      message: "Link is not found!",
      status: 404,
    });
  }
});

app.listen(PORT, () => console.log(`App is listening on port: ${PORT}`));
