const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const sendCookie = require("../utils/cookie.js");
const sendEmail = require("../utils/sendMail"); // Create this utility
const jwt = require("jsonwebtoken");


// const login = async (req, res, next) => {
//   try {
//     const { email, password, isOwner, oid } = req.body;

//     const user = await User.findOne({ email }).select("+password +oid +role");

//     if (!user) {
//       return res.status(400).json({ success: false, message: "Invalid Email or Password" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({ success: false, message: "Invalid Email or Password" });
//     }

//     // Role validation
//     if (isOwner) {
//       if (user.role !== "owner") {
//         return res.status(403).json({ success: false, message: "Not registered as an owner" });
//       }

//       if (!oid || user.oid !== oid) {
//         return res.status(403).json({ success: false, message: "Invalid OID" });
//       }

//     } else {
//       if (user.role === "owner") {
//         return res.status(403).json({ success: false, message: "Owner cannot login as a student" });
//       }
//     }

//     sendCookie(user, res, `Welcome back, ${user.username}`, 200);

//   } catch (error) {
//     next(error);
//   }
// };

const login = async (req, res, next) => {
  try {
    const { email, password, isOwner, oid } = req.body;

    const user = await User.findOne({ email }).select("+password +oid +role");

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid Email or Password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid Email or Password" });
    }

    // Role and OID validation logic:
    if (isOwner) {
      if (user.role !== "owner") {
        return res.status(403).json({ success: false, message: "Not registered as an owner" });
      }
      if (!oid || user.oid !== oid) {
        return res.status(403).json({ success: false, message: "Invalid OID" });
      }
    } else {
      if (user.role === "owner") {
        return res.status(403).json({ success: false, message: "Owner must login with OID" });
      }
    }

    // Now create token (from your sendCookie logic) and send user data:
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "Lax",
        expires: new Date(Date.now() +  60 * 60 * 1000),
      })
      .json({
        success: true,
        message: `Welcome back, ${user.username}`,
        id: user._id,
        name: user.username,
        role: user.role,
        token,
        isOwner: user.role === "owner",
      });

  } catch (error) {
    next(error);
  }
};



const generateOID = () => Math.floor(100000 + Math.random() * 900000).toString();

const register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const oid = role === "owner" ? generateOID() : undefined;
    user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      oid: oid,
    });


    if (role === "owner") {
      await sendEmail({
        to: email,
        subject: "Your Owner ID (OID)",
        text: `Welcome to PG Lookup! Your Owner ID (OID) is: ${oid}`,
      });
    }

    sendCookie(user, res, "Registered Successfully", 201);
  } catch (error) {
    next(error);
  }
};

const getMyProfile = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

const logout = (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      user: req.user,
      message: "Logged out successfully",
    });
};

const getInfoById = (req, res) => {

  const id = req.params.id;
  User.findById(id)
    .then(data => {
      if (!data) {
        res.status(404).send({ message: "Not found user with id" + id });
      } else {
        const { _id, username, email } = data;
        res.status(200).json({ success: true, user: { _id, username, email } });
      }
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving user with id" + id });
    });

}

const getAll = (req, res) => {
  User.find()
    .then(data => {
      const users = data.map(user => {
        const { _id, name, email } = user;
        return { _id, name, email };
      });
      res.status(200).json({ success: true, users });
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: err.message || "Error retrieving users" });
    });
}

module.exports = { login, register, getMyProfile, logout, getInfoById, getAll };