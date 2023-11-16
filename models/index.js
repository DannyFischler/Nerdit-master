const Sequelize = require("sequelize");
const sequelize = require("../config/connection");

const User = require("./User"); // Import the User model
const Game = require("./Game");
const Comment = require("./Comment");

// Define User and Comment associations
User.hasMany(Comment, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

Game.hasMany(Comment, {
  foreignKey: "game_id",
  onDelete: "CASCADE",
});

// // Existing Game and Comment associations
// Comment.belongsTo(Game, {
//   foreignKey: 'game_id',
// });

// Comment.belongsTo(User, {
//   foreignKey: 'user_id',
// });

module.exports = { User, Game, Comment }; // Export the User model
