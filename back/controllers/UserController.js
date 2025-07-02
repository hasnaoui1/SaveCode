const { User } = require("../models"); // Adjust the path if needed

const UserController = {
  // GET user by ID (optional helper)
  async getUserById(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  // UPDATE username + email
  async updateProfile(req, res) {
    const { username, email } = req.body;
    const userId = req.params.id;

    try {
      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      // Update fields
      user.username = username || user.username;
      user.email = email || user.email;

      await user.save();

      res.json({ message: "Profile updated successfully", user });
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({ message: "Email already in use" });
      }
      res.status(500).json({ message: "Server error" });
    }
  }
};

module.exports = UserController;
