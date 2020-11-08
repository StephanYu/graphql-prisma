import jwt from "jsonwebtoken";

const generateAuthToken = (uId) => {
  return jwt.sign({ uId }, "mysecret", { expiresIn: "7 days" });
};

export { generateAuthToken as default };
