const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

JWT_SECRET = process.env.JWT_SECRET;

class UserController {
  static register = async (req, res) => {
    try {
      const { name, email, password, confirmpassword } = req.body;

      if (!name || !email || !password || !confirmpassword) {
        return res.status(400).json({ error: 'All fields are required' })
      }
      const userExist = await User.findOne({ email });
      if (userExist) {
        return res.status(400).json({ message: "User already exists" });
      }
      if (password != confirmpassword) {
        return res.status(400).json({ error: 'Password not matching' });
      }
      const file = req.files.image;
      const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "user"
      })
      //console.log(imageUpload);  
      const hashPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        password: hashPassword,
        image: {
          public_id: imageUpload.public_id,
          url: imageUpload.secure_url
        }
      });
      res.status(201).json({ message: "User registered successfully", user });
    }
    catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static login = async (req, res) => {
    try {
      const { email, password, googleId, name, image } = req.body;

      let user = await User.findOne({ email });

      if (googleId) {
        if (!user) {
          user = await User.create({
            name,
            email,
            googleId,
            password: "google-auth",
            image: {
              public_id: "google",
              url: image,
            },
          });
        }

        const token = jwt.sign({ ID: user.id }, JWT_SECRET, { expiresIn: "4d" });

        return res
          .cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 4 * 24 * 60 * 60 * 1000,
          })
          .json({ message: "Google login successful", user });
      }

      
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ ID: user.id }, JWT_SECRET, { expiresIn: "4d" });

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        maxAge: 4 * 24 * 60 * 60 * 1000,
      }).json({ message: "Login successful", token });

    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  static logout = async (req, res) => {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
      });
      return res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
      res.status(400).json({ message: error.message });

    }
  }
  static getData = async (req, res) => {
    try {
      res.json(req.user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user" });
    }
  }
  static getProfile = async (req, res) =>
  {
    try
    {
      const id = req.user.id;
      const user = await User.findById(id);
      return res.status(200).json(user);
    }
    catch (error)
    {
      res.status(500).json({ message: "Error fetching profile" });
    }
  }
}
module.exports = UserController;
