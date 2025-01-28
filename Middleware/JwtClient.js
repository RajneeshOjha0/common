const jwt = require("jsonwebtoken");

const jwtSecretKey = "rajneesh";

const generateToken = async (email) => {
  try {
    const payload = {
      email: email,
      jwtSecretKey: jwtSecretKey,
      createdAt: Date.now(),
    };

    const token = jwt.sign(payload, jwtSecretKey);

    return token;
  } catch (error) {
    throw error;
  }
};

const verifyToken = async (req, res,next) => {
    console.log(req.body);
  const token = req.headers["authorization"] || req.headers["Authorization"];
  console.log(token);
  try {
    if (jwt.verify(token, jwtSecretKey)) {
       next();
    } else {
      res.status(401).json({status:false, message: "Token is not valid" });
    }
  } catch (error) {
    res.status(401).json({status:false, message: "Token is not valid" });
  }
};

module.exports = { generateToken, verifyToken };
