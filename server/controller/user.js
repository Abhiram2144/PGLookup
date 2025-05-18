const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const  sendCookie  = require("../utils/cookie.js");


const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user)
    {
        return res.status(400).json({success: false, message: "Invalid Email or Password"});
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({success: false, message: "Invalid Email or Password"});

    sendCookie(user, res, `Welcome back, ${user.username}`, 200);
  } catch (error) {
    next(error);
  }
};

const register = async (req, res,next) => {
  try {
    const { username, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user){
        return res.status(400).json({success: false, message: "User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({ username, email, password: hashedPassword });

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

const getInfoById = (req,res) =>{

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
    .send({message: "Error retrieving user with id" + id});
  });

}

const getAll = (req,res) =>{
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
    .send({message: err.message || "Error retrieving users"});
  });
}

module.exports = { login, register, getMyProfile, logout, getInfoById, getAll };