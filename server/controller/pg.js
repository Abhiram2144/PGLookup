const PG = require('../models/pg');
const imagekit = require("../utils/imageKit");
// ─────────────────────────────────────────────────────────
// CREATE PG
// ─────────────────────────────────────────────────────────
const createPg = async (req, res) => {

  const {
    pgName,
    address,
    contact,
    roomsVacant,
    rent,
    cityName,
    // images,
    description,
    collegeNames, // ONLY names come from frontend
    ownerId
  } = req.body;
  const files = req.files;

  let images = [];

    for (const file of files) {
      const result = await imagekit.upload({
        file: file.buffer,
        fileName: `${pgName}_${Date.now()}`,
      });
      images.push(result.url);
    }


  try {
    const existingPg = await PG.findOne({ pgName });
    if (existingPg) {
      return res.status(400).json({ message: "PG already exists" });
    }

    // console.log(res);

    const newPg = new PG({
      pgName,
      address,
      contact,
      roomsVacant,
      rent,
      cityName,
      images,
      description,
      collegeNames,
      ownerId,
      images
    });
    const savedPg = await newPg.save();
    res.status(200).send({ pg: savedPg, message: "New PG successfully added!!" });
  } catch (err) {
    res.status(400).json({ message: err.message || err });
  }
};

// ─────────────────────────────────────────────────────────
// GET ALL PGs
// ─────────────────────────────────────────────────────────
const getPgs = async (req, res) => {
  try {
    const pgs = await PG.find({})
      .populate('reviews')
      .populate('ownerId', '-password'); // if you have virtual population

    res.status(200).send({ pgs, message: "Fetched all PGs with reviews" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────
// GET PG BY ID
// ─────────────────────────────────────────────────────────
const getPgById = async (req, res) => {
  const pgid = req.params.pgid;
  try {
    const pg = await PG.findById(pgid)
      .populate('reviews')
      .populate('ownerId', '-password');

    if (!pg) {
      return res.status(404).json({ message: "PG not found" });
    }

    res.status(200).send({ pg });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────
// DELETE PG
// ─────────────────────────────────────────────────────────
const deletePg = async (req, res) => {
  const pgid = req.params.pgid;
  try {
    const deletedPg = await PG.findByIdAndDelete(pgid);

    if (!deletedPg) {
      return res.status(404).json({ message: "PG not found" });
    }

    res.status(200).send({ pg: deletedPg, message: "PG removed successfully!!" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────
// UPDATE PG
// ─────────────────────────────────────────────────────────
const updatePg = async (req, res) => {
  const pgid = req.params.pgid;
  const {
    pgName,
    address,
    contact,
    roomsVacant,
    rent,
    cityName,
    images,
    description,
    collegeNames
  } = req.body;

  try {
    const existingPg = await PG.findById(pgid);
    if (!existingPg) {
      return res.status(404).json({ message: "PG not found" });
    }



    const updatedPg = await PG.findByIdAndUpdate(
      pgid,
      {
        pgName,
        address,
        contact,
        roomsVacant,
        rent,
        cityName,
        images,
        description,
        collegeNames,
      },
      { new: true } // return the updated doc
    );

    res.status(200).send({ pg: updatedPg, message: "PG updated Successfully!!" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// get pg by user id

const getPgsByOwnerId = async (req, res) => {
  const ownerId = req.params.ownerId;

  try {
    const { ObjectId } = require('mongoose').Types;
    
    if (!ObjectId.isValid(ownerId)) {
      return res.status(400).json({ message: 'Invalid ownerId' });
    }

    const pgs = await PG.find({ ownerId: new ObjectId(ownerId) });
    // const pgs = await PG.find({ ownerId: objectId });
    res.status(200).json({ pgs });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createPg,
  getPgs,
  getPgById,
  deletePg,
  updatePg,
  getPgsByOwnerId,
};
