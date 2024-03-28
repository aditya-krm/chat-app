import jwt from "jsonwebtoken";

const generateToken_setCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, //ms of 15sec
    httpOnly: true, //prevent XSS attack
    sameSite: "strict", //CSRF attack safe
    secure: process.env.NODE_ENV === "production" ? true : false, //cookie only sent over HTTPS in production
  });
};

export default generateToken_setCookie;
