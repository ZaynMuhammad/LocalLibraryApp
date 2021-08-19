const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GenreSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 100,
  },
});

// Virtual for genre url
GenreSchema.virtual("url").get(function () {
  return "/catalog/genre/" + this._id;
});

const Genre = mongoose.model("Genre", GenreSchema);

// Exports
module.exports = Genre;
