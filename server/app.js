const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// User Controllers
const {
  register,
  login,
  getMyProfile,
  logout,
  getInfoById,
  getAll
} = require("./controller/user");

// Review Controllers
const {
  createReview,
  getReviews,
  editReview,
  deleteReview,
  getReviewById
} = require("./controller/review");

// PG Controllers
const {
  getPgs,
  getPgById,
  createPg,
  deletePg,
  updatePg
} = require("./controller/pg");

// College Controllers
const {
  getColleges,
  getCollegeById,
  createCollege,
  deleteCollege,
  updateCollege
} = require("./controller/college");

// Middleware
const { checkAuth } = require("./middleware/authentication");

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: '*' }));

// Server and DB
app.listen(8000, () => {
  console.log("Server running on port 8000");
  mongoose.connect(`mongodb+srv://abhiram:abhiram@cluster0.qar6awa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => console.log("Connected to database!"))
    .catch((err) => console.error("MongoDB connection error:", err));
});


// ----- USER Routes -----
app.post("/api/v1/user/new", register);
app.post("/api/v1/user/login", login);
app.get("/api/v1/user/logout", logout);
app.get("/api/v1/user/me", checkAuth, getMyProfile);
app.get("/api/v1/user/user/:id", getInfoById);
app.get("/api/v1/user/users", getAll);
app.get("/api/v1/user", (req, res) => {
  res.send("Hello from user route");
});


// ----- REVIEW Routes -----
app.post("/api/v1/review/create/:uid/:pgid", checkAuth, createReview);
app.get("/api/v1/review/all", getReviews);
app.get("/api/v1/review/:rid", getReviewById);
app.delete("/api/v1/review/:rid", checkAuth, deleteReview);
app.patch("/api/v1/review/:rid", checkAuth, editReview);


// ----- PG Routes -----
app.get("/api/v1/pg/all", getPgs);
app.get("/api/v1/pg/pg/:pgid", getPgById);
app.post("/api/v1/pg/new", checkAuth, createPg);
app.delete("/api/v1/pg/delete/:pgid", checkAuth, deletePg);
app.patch("/api/v1/pg/edit/:pgid", checkAuth, updatePg);




// ----- COLLEGE Routes -----
app.get("/api/v1/college/all", getColleges);
app.get("/api/v1/college/college/:collegeid", getCollegeById);
app.post("/api/v1/college/new", checkAuth, createCollege);
app.delete("/api/v1/college/delete/:collegeid", checkAuth, deleteCollege);
app.patch("/api/v1/college/edit/:collegeid", checkAuth, updateCollege);


// Root Route
app.get("/", (req, res) => {
  res.send("Hello World!");
});
