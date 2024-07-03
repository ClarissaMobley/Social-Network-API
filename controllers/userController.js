const { User, Thought } = require("../models");

module.exports = {
  // Get all Users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error. Please try again later." });
    }
  },

  // Get single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select("-__v")
        .populate("thoughts")
        .populate("friends");

      if (!user) {
        return res.status(404).json({ message: "No user with that ID" });
      }

      res.json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error. Please try again later." });
    }
  },

  // Create New User
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Error creating user. Please check your input and try again." });
    }
  },

  // Update User
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "No user with this ID" });
      }

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Error updating user. Please check your input and try again." });
    }
  },

  // Delete User
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: "No user with this ID" });
      }

      // Remove associated thoughts
      await Thought.deleteMany({ username: user.username });
      res.json({ message: "User and associated thoughts deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
  },

  // Add a friend
  async addFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      ).populate("friends");

      if (!user) {
        return res.status(404).json({ message: "No user with this ID" });
      }

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
  },

  // Remove a friend
  async removeFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      ).populate("friends");

      if (!user) {
        return res.status(404).json({ message: "No user with this ID" });
      }

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
  },
};
