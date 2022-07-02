/*require("dotenv").config();

const express = require("express");
const cors = require("cors");
const routes = require('./routes/pokemon');
const app = express();
const axios = require("axios").default;

const { PORT = 3000 } = process.env;

const CACHE = {};
const ERROR = {};

app.use(cors());

app.get("/cache", function (req, res) {
  res.json({ data: CACHE });
});

app.post("/pokemon/:name", async function (req, res) {
  const { name } = req.params;
  if (CACHE[name]) {
    return res.json({ name, data: JSON.parse(CACHE[name]), isCached: true });
  }
  if (ERROR[name]) {
    return res.json({ name, data: JSON.parse(ERROR[name]), isCached: true });
  }

  const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
  let responseData;
  try {
    const { data } = await axios.get(url);
    responseData = data;
    CACHE[name] = JSON.stringify(data);
  } catch {
    responseData = data;
    ERROR[name] = JSON.stringify({ name, error: "Invalid pokemon." });
  }
  res.json({ name, data: responseData, isCached: false });
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}...`);
}); */
require("dotenv").config();
const axios = require("axios").default;
const express = require('express');
const cors = require("cors");
const pokemonRoute = require('./routes/pokemon');
const app = express();
const { PORT = 3000 } = process.env;

const CACHE = {};
const ERROR = {};

app.use(cors());
 
app.use('/', pokemonRoute);
//const port = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}, http://localhost:${PORT}`));