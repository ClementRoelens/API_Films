const express = require("express");
const router = express.Router();
const filmCtrl = require("../controllers/film");
// const validator = require("../middlewares/validateFilm");
const multer = require("../middlewares/multer-config");
const auth = require("../middlewares/authentification");

// Les get
// Renvoie la totalité
router.get("/getAllFilms", filmCtrl.getAllFilms);
router.get("/getAllInOneGenre/:genre", filmCtrl.getAllInOneGenre);
router.get("/getAllInOneDirector/:director", filmCtrl.getAllInOneDirector);
// Renvoie un certain nombre au hasard
router.get("/getRandomFilms", filmCtrl.getRandomFilms);
router.get("/getRandomInOneGenre/:genre",filmCtrl.getRandomInOneGenre);
router.get("/getRandomInOneDirector/:director",filmCtrl.getRandomInOneDirector);
router.get("/getOneRandom", filmCtrl.getOneRandom);
// Renvoie un seul film choisi
router.get("/getOneFilm/:id", filmCtrl.getOneFilm);

// Les autres
// Il serait bien plus logique de d'abord valider, et d'ensuite si la requête est bonne d'ajouter l'image... Mais je n'ai pas encore trouvé comment
router.post("/addOneFilm", multer, filmCtrl.addOneFilm);
// router.post("/like/:id", auth, filmCtrl.like);
// router.post("/dislike/:id", auth , filmCtrl.dislike);
// router.post("/addOpinion/:filmId/:noticeId", auth, filmCtrl.ajouterAvis);

router.put("/fix",filmCtrl.fix);


// router.delete("/:id",filmCtrl.supprimer);




module.exports = router;