const express = require("express");
const bodyParser = require("body-parser");
const mooviesRoutes = require("./src/routes/moovies");
const categoryRoutes = require("./src/routes/category");

const app = express();

app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

app.use("/moovies", mooviesRoutes);
app.use("/category", categoryRoutes);

app.listen(PORT, () => {
  console.log("server running on http/localhost:${PORT}");
});
