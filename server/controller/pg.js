const PG = require('../models/pg');
const College = require('../models/college');

// ─────────────────────────────────────────────────────────
// CREATE PG
// ─────────────────────────────────────────────────────────
const createPg = async (req, res) => {
  console.log("came till here, createpg first line");
  
  const {
    pgName,
    address,
    contact,
    roomsVacant,
    rent,
    cityName,
    images,
    description,
    collegeNames, // ONLY names come from frontend
  } = req.body;
  console.log(req.body);
  
  console.log(req.user);
  try {
    const existingPg = await PG.findOne({ pgName });
    if (existingPg) {
      return res.status(400).json({ message: "PG already exists" });
    }

    // Fetch collegeIds from names
    const colleges = await College.find({ collegeName: { $in: collegeNames } });

    if (colleges.length !== collegeNames.length) {
      const foundNames = colleges.map(c => c.collegeName);
      const notFound = collegeNames.filter(name => !foundNames.includes(name));
      return res.status(400).json({
        message: `Invalid college name(s): ${notFound.join(', ')}`
      });
    }

    const collegeIds = colleges.map(college => college._id);
    const ownerId = req.user._id;
    

  if (req.user.role !== "owner") {
    return res.status(401).json({ message: "Unauthorized: Owner not identified." });
  }
    const newPg = new PG({
      pgName,
      address,
      contact,
      roomsVacant,
      rent,
      cityName,
      images,
      description,
      collegeIds,
      collegeNames,
      ownerId,
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
      .populate('collegeIds')        // for full college details
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
      .populate('collegeIds')
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

    // Convert names to IDs again
    const colleges = await College.find({ collegeName: { $in: collegeNames } });

    if (colleges.length !== collegeNames.length) {
      const foundNames = colleges.map(c => c.collegeName);
      const notFound = collegeNames.filter(name => !foundNames.includes(name));
      return res.status(400).json({
        message: `Invalid college name(s): ${notFound.join(', ')}`
      });
    }

    const collegeIds = colleges.map(college => college._id);

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
        collegeIds,
        collegeNames,
      },
      { new: true } // return the updated doc
    );

    res.status(200).send({ pg: updatedPg, message: "PG updated Successfully!!" });
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
};
