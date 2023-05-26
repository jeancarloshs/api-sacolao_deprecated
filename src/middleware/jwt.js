const constants = require("../constants/constants");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;
// const { userId } = require("../controllers/UserController");

const responseModel = {
  success: false,
  error: "",
};

module.exports = function verifyJWT(req, res, next) {
  const response = { ...responseModel };
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res
      .status(constants['403'].status)
      .json({ error: constants['403'].tokenNotFound });
  }

  const token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, SECRET, (error, decode) => {
    if (error) {
      response.error = constants['401'].tokenItsNotValid;
      return res.status(401).json(response);
    }
    req.userId = decode.userId;
    next();
  });
};
