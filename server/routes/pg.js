const express = require("express");
const { getPgs, getPgById, createPg, deletePg, updatePg } = require("../controller/pg");
const { checkAuth } = require("../middleware/authentication");

const router = express.Router();

router.get("/all",getPgs);
router.get("/pg/:pgid",getPgById);
router.post("/new",checkAuth,createPg);
router.delete("/delete/:pgid", checkAuth, deletePg);
router.patch("/edit/:pgid", checkAuth, updatePg);

// query params
router.get("/pg", (req, res) => {
    const { id } = req.query;
    if (!id) {
      return res.status(400).send("Missing required parameter: id");
    }
    getPgById(id)
      .then((pg) => {
        if (!pg) {
          return res.status(404).send("PG not found");
        }
        res.send(pg);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Internal server error");
      });
  });

module.exports = router;