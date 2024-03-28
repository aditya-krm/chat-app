import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateToken_setCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { name, username, email, password, confirmPassword, gender } =
      req.body;
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and Confirm Password need to be same" });
    }
    const userExist = await User.findOne({ username });
    if (userExist) {
      return res
        .status(400)
        .json({ message: "username already exists please choose another" });
    }
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.status(400).json({ message: "email already registered!" });
    }

    //hash the password for saving the hashed password in the db
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      name: name,
      username: username,
      email: email,
      password: hashedPassword,
      gender,
      profilePicture: gender == "male" ? boyProfilePic : girlProfilePic,
    });
    if (newUser) {
      generateToken_setCookie(newUser._id, res);
      await newUser
        .save()
        .then(() => {
          console.log("User created successfully");
        })
        .catch((error) => {
          console.log(`Error in creating user: ${error}`);
        });

      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        profilePicture: newUser.profilePicture,
      });
    } else {
      res.status(400).json({ message: "Invalid user info" });
    }
  } catch (error) {
    console.log(`might be some error in login function: ${error}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = (req, res) => {
  // res.json({message: "Signup Success"});

  res.send("login Success");
};

export const logout = (req, res) => {
  // res.json({message: "Logout Success"});
  res.send("Logout Success");
};
