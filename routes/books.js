const dbHelper = require("../dbHelper");

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
    id: { type: "string" },
  },
  required: ["id"],
};

const booksDb = dbHelper("books");

// Handlers
async function createbook(request, reply) {
  const newbook = await booksDb.insert(request.body);
  return reply.status(201).send(newbook);
}

async function getbooks(request, reply) {
  const books = await booksDb.findAll();
  return reply.send(books);
}

async function getbookById(request, reply) {
  const book = await booksDb.findById(request.params.id);
  if (!book) {
    return reply.status(404).send({ message: "book not found." });
  }
  return reply.send(book);
}

async function updatebook(request, reply) {
  const updatedbook = await booksDb.update(
    request.params.id,
    request.body,
  );
  if (!updatedbook) {
    return reply.status(404).send({ message: "book not found." });
  }
  return reply.send(updatedbook);
}

async function deletebook(request, reply) {
  const numRemoved = await booksDb.delete(request.params.id);
  if (numRemoved === 0) {
    return reply.status(404).send({ message: "book not found." });
  }
  return reply.status(204).send();
}

// Routes Mapping with validation schemas
function routes(app) {
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
