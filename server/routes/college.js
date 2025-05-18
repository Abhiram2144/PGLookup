const express = require("express");
const { checkAuth } = require("../middleware/authentication");
const { getColleges, getCollegeById, createCollege, deleteCollege, updateCollege } = require("../controller/college");

const router = express.Router();

router.get("/all",getColleges );
router.get("/college/:collegeid",getCollegeById);

router.post("/new",checkAuth, createCollege);
router.delete("/delete/:collegeid", checkAuth, deleteCollege);
router.patch("/edit/:collegeid", checkAuth, updateCollege);

module.exports = router;