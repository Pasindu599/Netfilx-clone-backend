import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export async function signup(req, res, next) {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({
        sucess: false,
        message: "Please enter all fields",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        sucess: false,
        message: "Invalid Email",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        sucess: false,
        message: "Password must be atleast 6 characters",
      });
    }

    const existingUserByEmail = await User.findOne({
      email: email,
    });

    if (existingUserByEmail) {
      return res.status(400).json({
        sucess: false,
        message: "User with this email already exists",
      });
    }

    const existingUserByUsername = await User.findOne({
      username: username,
    });

    if (existingUserByUsername) {
      return res.status(400).json({
        sucess: false,
        message: "User with this username already exists",
      });
    }

    const PROFILE_PICS = [];

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      username,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      return res.status(201).json({
        sucess: true,
        message: "User created successfully",
        user: {
          ...newUser._doc,
          password: "",
        },
      });
    } else {
      return res.status(500).json({
        sucess: false,
        message: "Internal Server Error",
      });
    }
  } catch (err) {
    console.error(err);
    res.stutus(500).json({
      sucess: false,
      message: "Internal Server Error",
    });
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        sucess: false,
        message: "Please enter all fields",
      });
    }
    const user = await User.findOne({
      email: email,
    });

    if (!user) {
      return res.status(400).json({
        sucess: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        sucess: false,
        message: "Invalid credentials",
      });
    }

    generateTokenAndSetCookie(user._id, res);

    return res.status(200).json({
      sucess: true,
      message: "User logged in successfully",
      user: {
        ...user._doc,
        password: "",
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      sucess: false,
      message: "Internal Server Error",
    });
  }
}

export async function logout(req, res, next) {
  try {
    res.clearCookie("jwt-netflix");
    return res.status(200).json({
      sucess: true,
      message: "User logged out successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      sucess: false,
      message: "Internal Server Error",
    });
  }
}

export async function getAllUsers(req, res, next) {
  try {
    const users = await User.find();
    return res.status(200).json({
      sucess: true,
      message: "All users fetched successfully",
      users: users,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      sucess: false,
      message: "Internal Server Error",
    });
  }
}
