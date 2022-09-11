const express = require("express");
const router = express.Router();
const opinionCtrl = require("../controllers/opinion");
const auth = require("../middlewares/authentification");

router.get("/getOneOpinion/:id",opinionCtrl.getOneOpinion);
router.put("/editOpinion/:id",auth,opinionCtrl.editOpinion);
// router.get("/getAllOpinions",opinionCtrl.getAllOpinions);


// router.put("/fixOpinion",opinionCtrl.fixOpinions);
// router.get("/fixOpinionLikes",opinionCtrl.fixOpinionLikes);
// router.delete("/eraseAllOpinions",opinionCtrl.eraseAllOpinions);

module.exports = router;