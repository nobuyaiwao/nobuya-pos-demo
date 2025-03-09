const express = require("express");
const path = require("path");
const { PORT } = require("./config");
const routes = require("./routes");

const app = express();

console.log("Server starting...");
console.log(`Running on port ${PORT}`);

app.use(express.static(path.join(__dirname, "../src"), { extensions: ["html", "js", "css"] }));
app.use(routes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../src/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

