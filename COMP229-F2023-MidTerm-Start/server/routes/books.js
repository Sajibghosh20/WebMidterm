// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/
    const title = 'Add a New Book'; // Set the title for the page
   const books = {}; // Create an empty object for the book data (since the form will be initially blank)

  res.render('books/details', {
    title: title,
    books: books, // Pass the empty book data
  });

});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/
     // Extract book data from the request body
  const { title, price, author, genre } = req.body;

  // Create a new book object (excluding the _id property)
  const newBook = new book({
    Title: title,
    Price: price,
    Author: author,
    Genre: genre,
  });

  // Save the new book to the database
  newBook.save((err) => {
    if (err) {
      return console.error(err);
    }
    res.redirect('/books'); // Redirect to the books list page
  });

});

// GET the Book Details page in order to edit an existing Book
router.get('/:id', (req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/
    const title = 'Edit Book'; // Set the title for the page
  const id = req.params.id; // Get the id from the URL

  // Use the id to fetch the book from the database
  Book.findById(id, (err, bookData) => {
    if (err) {
      return console.error(err);
    }
    
    if (!bookData) {
      // Handle the case where the book doesn't exist
      // You can render an error page or redirect to a relevant location
      res.render('error', { message: 'Book not found' });
    } else {
      res.render('books/details', {
        title: title,
        books: bookData, // Pass the book data from the database to the view
      });
    }
  });
});

// POST - process the information passed from the details form and update the document
router.post('/:id', (req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/
    const id = req.params.id; // Get the id from the URL
    const { title, price, author, genre } = req.body;
  
    // Create a book object with the _id property
    const updatedBook = {
      _id: id,
      Title: title,
      Price: price,
      Author: author,
      Genre: genre,
    };
  
    // Update the existing book in the database using updateOne
    Book.updateOne({ _id: id }, updatedBook, (err) => {
      if (err) {
        return console.error(err);
      }
      res.redirect('/books'); // Redirect to the books list page
    });

});

// GET - process the delete by user id
router.get('/delete/:id', (req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/
    const id = req.params.id; // Get the id from the URL

  // Remove the existing book from the database by its _id
  book.remove({ _id: id }, (err) => {
    if (err) {
      return console.error(err);
    }
    res.redirect('/books'); // Redirect to the books list page after deletion
  });
});


module.exports = router;
