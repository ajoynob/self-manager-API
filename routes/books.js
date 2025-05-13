// In-memory "database"
let books = [];
let idCounter = 1;

// Handlers

/**
 * Create a new Book
 */
async function createBook(request, response) {
  const { title, author, genre, publication_date, status, notes } =
    request.body;

  if (!title || !author || !genre) {
    return response
      .status(400)
      .send({ message: "Title, Author, and Genre are required." });
  }

  const newBook = {
    id: idCounter++,
    title,
    author,
    genre,
    publication_date,
    status,
    notes,
  };

  books.push(newBook);
  return response.status(201).send(newBook);
}

/**
 * Get all books
 */
async function getBooks(request, response) {
  return response.send(books);
}

/**
 * Get a single Book by ID
 */
async function getBookById(request, response) {
  const Book = books.find((c) => c.id === parseInt(request.params.id));

  if (!Book) {
    return response.status(404).send({ message: "Book not found." });
  }

  return response.send(Book);
}

/**
 * Update a Book by ID
 */
async function updateBook(request, response) {
  const { title, author, genre, publication_date, status, notes } =
    request.body;
  const Book = books.find((c) => c.id === parseInt(request.params.id));

  if (!Book) {
    return response.status(404).send({ message: "Books not found." });
  }

  Object.assign(Book, {
    title: title || Book.title,
    author: author || Book.author,
    genre: genre || Book.genre,
    publication_date: publication_date || Book.publication_date,
    status: status || Book.status,
    notes: notes || Book.notes,
  });
  return response.send(Book);
}

/**
 * Delete a Book by ID
 */
async function deleteBook(request, response) {
  const BookIndex = books.findIndex(
    (c) => c.id === parseInt(request.params.id)
  );

  if (BookIndex === -1) {
    return response.status(404).send({ message: "Books not found." });
  }

  books.splice(BookIndex, 1);
  return response.status(204).send();
}

// Routes Mapping
function routes(app) {
  app.post("/books", createBook);
  app.get("/books", getBooks);
  app.get("/books/:id", getBookById);
  app.put("/books/:id", updateBook);
  app.delete("/books/:id", deleteBook);
}

exports.routes = routes;
