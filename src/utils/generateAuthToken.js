import jwt from "jsonwebtoken";

const generateAuthToken = (uId) => {
  return jwt.sign({ uId }, process.env.JWT_SECRET, { expiresIn: "7 days" });
};

export { generateAuthToken as default };
