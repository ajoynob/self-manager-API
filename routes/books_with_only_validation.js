// In-memory "database"
let books = [];
let idCounter = 1;

// Schemas for validation
const bookSchema = {
  type: "object",
  required: ["title", "author", "genre"],
  properties: {
    title: { type: "string" },
    author: { type: "string" },
    genre: { type: "string" },
    publication_date: { type: "string" },
    status: { type: "string" },
    notes: { type: "string" },
  },
};

const idParamSchema = {
  type: "object",
  properties: {
    id: { type: "integer", minimum: 1 },
  },
  required: ["id"],
};

// Handlers

/**
 * Create a new book
 */
async function createbook(request, response) {
  const { title, author, genre, publication_date, status, notes } = request.body;

  if (!title || !author || !genre) {
    return response
      .status(400)
      .send({ message: "title, author, and genre are required." });
  }

  const newbook = {
    id: idCounter++,
    title,
    author,
    genre,
    publication_date,
    status,
    notes,
  };

  books.push(newbook);
  return response.status(201).send(newbook);
}

/**
 * Get all books
 */
async function getbooks(request, response) {
  return response.send(books);
}

/**
 * Get a single book by ID
 */
async function getbookById(request, response) {
  const book = books.find((c) => c.id === parseInt(request.params.id));

  if (!book) {
    return response.status(404).send({ message: "book not found." });
  }

  return response.send(book);
}

/**
 * Update a book by ID
 */
async function updatebook(request, response) {
  const { title, author, genre, publication_date, status, notes } = request.body;
  const book = books.find((c) => c.id === parseInt(request.params.id));

  if (!book) {
    return response.status(404).send({ message: "book not found." });
  }

  Object.assign(book, {
    title: title || book.title,
    author: author || book.author,
    genre: genre || book.genre,
    publication_date: publication_date || book.publication_date,
    status: status || book.status,
    notes: notes || book.notes,
  });
  return response.send(book);
}

/**
 * Delete a book by ID
 */
async function deletebook(request, response) {
  const bookIndex = books.findIndex(
    (c) => c.id === parseInt(request.params.id),
  );

  if (bookIndex === -1) {
    return response.status(404).send({ message: "book not found." });
  }

  books.splice(bookIndex, 1);
  return response.status(204).send();
}

// Routes Mapping
function routes(app) {
  // app.post("/books", createbook);
  // app.get("/books", getbooks);
  // app.get("/books/:id", getbookById);
  // app.put("/books/:id", updatebook);
  // app.delete("/books/:id", deletebook);

  app.post("/books", { schema: { body: bookSchema } }, createbook);
  app.get("/books", getbooks);
  app.get(
    "/books/:id",
    { schema: { params: idParamSchema } },
    getbookById,
  );
  app.put(
    "/books/:id",
    { schema: { params: idParamSchema, body: bookSchema } },
    updatebook,
  );
  app.delete(
    "/books/:id",
    { schema: { params: idParamSchema } },
    deletebook,
  );
}

exports.routes = routes;
