const Genre = require("../models/genre");
const Book = require("../models/book");
const async = require("async");
const { body, validationResult } = require("express-validator");

// Display list of all Genre.
const genre_list = (req, res, next) => {
  Genre.find()
    .sort([["name", "ascending"]])
    .exec(function (err, list_genres) {
      if (err) {
        return next(err);
      }

      res.render("genre_list", {
        title: "Genre list",
        genre_list: list_genres,
      });
    });
};

// Display detail page for a specific Genre.
const genre_detail = (req, res, next) => {
  async.parallel(
    {
      genre: function (callback) {
        Genre.findById(req.params.id).exec(callback);
      },

      genre_books: function (callback) {
        Book.find({ genre: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.genre == null) {
        // no results
        const err = new Error("Genre not found");
        err.status = 404;
        return next(err);
      }

      // Successful, so render
      res.render("genre_detail", {
        title: "Genre detail",
        genre: results.genre,
        genre_books: results.genre_books,
      });
    }
  );
};

// Display Genre create form on GET.
const genre_create_get = (req, res) => {
  res.render("genre_form", { title: "Create Genre " });
};

// Handle Genre create on POST.
// const genre_create_post = (req, res) => {
//   res.send("NOT IMPLEMENTED: Genre create POST");
// };

const genre_create_post = [
  // Validate and sanitize the name field.
  body("name", "Genre name required").trim().isLength({ min: 1 }).escape(),

  // process the request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("genre_form", {
        title: "Create Genre",
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from the form is valid
      // Check if genre with the same name already exists
      Genre.findOne({ name: req.body.name }).exec(function (err, found_genre) {
        if (err) {
          return next(err);
        }
        if (found_genre) {
          // Genre exists
          res.redirect(found_genre.url);
        } else {
          genre.save(function (err) {
            if (err) {
              return next(err);
            }
            // Genre saved, redirect to genre detail page.
            res.redirect(genre.url);
          });
        }
      });
    }
  },
];

// Display Genre delete form on GET.
const genre_delete_get = (req, res, next) => {
  async.parallel(
    {
      genre: function (callback) {
        Genre.findById(req.params.id).exec(callback);
      },
      book_genres: function (callback) {
        Book.find({ genre: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.genre == null) {
        // No results
        res.redirect("/catalog/genres");
      }
      // Successful, so render
      res.render("genre_delete", {
        title: "Delete Genre",
        genre: results.genre,
        book_genres: results.book_genres,
      });
    }
  );
};

// Handle Genre delete on POST.
const genre_delete_post = (req, res, next) => {
  async.parallel(
    {
      genre: function (callback) {
        Genre.findById(req.body.id).exec(callback);
      },
      book_genres: function (callback) {
        Book.find({ genre: req.body.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.book_genres.length > 0) {
        // Genre has books associated with it, display list of books
        res.render("genre_delete", {
          genre: results.genre,
          book_genres: results.book_genres,
        });
        return;
      } else {
        Genre.findByIdAndRemove(req.body.id, function deleteGenre(err) {
          // Successful, so render genre list
          res.redirect("/catalog/genres");
        });
      }
    }
  );
};

// Display Genre update form on GET.
const genre_update_get = (req, res) => {
  Genre.findById(req.params.id, function (err, genre) {
    if (err) {
      return next(err);
    }
    if (genre == null) {
      const err = new Error("Genre not found");
      err.status = 404;
      return next(err);
    }
    // Success
    res.render("genre_form", { title: "Update Genre", genre: genre });
  });
};

// Handle Genre update on POST.
const genre_update_post = [
  body("name", "Name must not be empty").trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const genre = new Genre({
      name: req.body.name,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("genre_form", { title: "Update Genre", genre: genre });
      return;
    } else {
      Genre.findByIdAndUpdate(req.params.id, genre, {}, function (err, genre) {
        if (err) {
          return next(err);
        }
        // Succesful, so redirect back to genre list
        res.redirect(genre.url);
      });
    }
  },
];

module.exports = {
  genre_list,
  genre_detail,
  genre_create_get,
  genre_create_post,
  genre_delete_get,
  genre_delete_post,
  genre_update_get,
  genre_update_post,
};
