const User = require("./database/model/userModel");
const bcrypt = require("bcrypt");

const adminSeeder = async () => {
  try {
    const user = await User.findOne({ email: "admin@gmail.com" });
    if (!user) {
      await User.create({
        email: "admin@gmail.com",
        password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 8),
        username: "admin",
        role: "admin",
      });
      console.log("Admin credentials seeded successfully");
    } else {
      console.log("Admin credentials already seeded.");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
};

module.exports = adminSeeder;
