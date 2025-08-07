const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../database/model/userModel");

class userController {
  // Register API:
  async registerUser(req, res) {
    try {
      const { username, email, password, role } = req.body;
      if (!username || !email || !password) {
        res.status(400).json({
          message: "Please provide username, email, password",
        });
        return;
      }
      await User.create({
        username,
        email,
        password: bcrypt.hashSync(password, 8),
        role,
      });

      res.status(200).json({
        message: "User registered successfully",
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ message: "Error registering user", error });
    }
  }

  // Login API:
  async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({
          message: "Please provide email, password",
        });
        return;
      }

      //Check whether user with above email exist or not:
      const user = await User.findOne({ email: email });
      if (!user) {
        res.status(400).json({
          message: "No user found with that email",
        });
        return;
      }

      //Check password:
      const isMatched = bcrypt.compareSync(password, user.password); //returns boolean "True" or "False"
      if (isMatched) {
        //Generate Token:
        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
          expiresIn: "20d",
        });

        res.status(200).json({
          message: "Logged in successfully",
          data: token,
        });
      } else {
        res.status(400).json({
          message: "Invalid email or password",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Error login user", error });
    }
  }
}

module.exports = new userController();
