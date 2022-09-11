const express = require("express");
const app = express();
const filmRoutes = require("./routes/film");
const userRoutes = require("./routes/user");
const opinionRoutes = require("./routes/opinion");
const sharedRoutes = require("./routes/shared");
const path = require("path");

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://ClementRoelens:Test1234@cluster0.62z4x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

// Mise en place des headers gérant la CORS Policy
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/film", filmRoutes);
app.use("/user", userRoutes);
app.use("/opinion", opinionRoutes);
app.use("/shared", sharedRoutes);

module.exports = app;