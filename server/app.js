require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // Or your email service
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
const Pg = require("./models/pg");
// index.js or app.js

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
const { checkAuth, authorizeRoles } = require("./middleware/authentication");

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

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
app.post("/api/v1/pg/new", createPg);
app.delete("/api/v1/pg/delete/:pgid", authorizeRoles("owner"), checkAuth, deletePg);
app.patch("/api/v1/pg/edit/:pgid", authorizeRoles("owner"),checkAuth, updatePg);

app.post("/api/v1/pg/contact-owner", async (req, res) => {
  try {
    const { pgId, ownerEmail, contactDetails, pgName } = req.body;

    if (!ownerEmail) {
      return res.status(400).json({ message: "Owner email is required" });
    }

    const { name, occupation, homeState, phone } = contactDetails;

    // Compose email content with the contact details
    const mailOptions = {
      from: `"PG Contact" <${process.env.SMTP_USER}>`,
      to: ownerEmail,
      subject: `New Contact Request for PG ID: ${pgName}`,
      html: `
        <h3>Contact Request Details</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Occupation:</strong> ${occupation}</p>
        <p><strong>Home State:</strong> ${homeState}</p>
        <p><strong>Phone Number:</strong> ${phone}</p>
        <p><strong>PG ID Interested:</strong> ${pgName}</p>
      `,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Failed to send email" });
      }
      console.log("Email sent: " + info.response);
      return res.status(200).json({ message: "Email sent successfully" });
    });
  } catch (error) {
    console.error("Contact owner error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


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

