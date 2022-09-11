const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const auth = require("../middlewares/authentification");

router.get("/getOneUser/:id", userCtrl.getOneUser);
router.get("/getAllUsers",userCtrl.getAllUsers)
router.post("/signup", userCtrl.signup);
router.post("/signin", userCtrl.signin);
// router.post("/likedFilm", auth, userCtrl.filmLiked);
// router.post("/dislikedFilm", auth, userCtrl.filmDisliked);
// router.post("/addOpinion/:userId/:filmId", auth, userCtrl.addNotice);
// router.post("/eraseNotice/:userId/:filmId", auth, userCtrl.eraseNotice);

// Uniquement utilisées pour le développement
// router.get("/getLikedFilms/:id", userCtrl.getLikedFilms);
// router.get("/getOpinions/:id", userCtrl.getOpinions);
// router.get("/getDislikedFilms/:id", userCtrl.getDislikedFilms);
// router.get("/fix",userCtrl.fix);

module.exports = router;