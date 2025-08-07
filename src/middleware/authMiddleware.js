const jwt = require("jsonwebtoken");
const User = require("../database/model/userModel");

class AuthMiddleware {
  async authenticate(req, res, next) {
    const token = req.headers.authorization;
    // console.log("Authorization header:", token);
    if (!token || token === undefined) {
      res.status(404).json({
        message: "Token not provided.",
      });
      return;
    }

    //Verify token(legit or tampered):
    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        res.status(403).json({
          message: "Invalid token",
        });
      } else {
        try {
          //Check if decoded object id user exist or not:
          const userData = await User.findById(decoded.id);
          if (!userData) {
            res.status(404).json({
              message: "No user with that token.",
            });
            return;
          }
          req.user = userData;
          next();
        } catch (error) {
          res.status(500).json({
            message: "Something went wrong.",
          });
        }
      }
    });
  }

  restrictTo = (...roles) => {
    return (req, res, next) => {
      const userRole = req.user?.role;
      console.log("User Role:", userRole);
      if (!roles.includes(userRole)) {
        return res.status(403).json({ message: "You don't have permission" });
      }
      next();
    };
  };
}

const authMiddleware = new AuthMiddleware();
module.exports = {
  authenticate: authMiddleware.authenticate,
  restrictTo: authMiddleware.restrictTo,
  ADMIN: "admin",
  USER: "user",
};
