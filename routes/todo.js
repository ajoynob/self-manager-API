const dbHelper = require("../dbHelper");

// Schemas for validation
const todoSchema = {
  type: "object",
  required: ["title", "description", "due_date"],
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    due_date: { type: "string"},
    priority: { type: "string" },
    status: { type: "string" },
  },
};

const idParamSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
};

const todosDb = dbHelper("todos");

// Handlers
async function createtodo(request, reply) {
  const newtodo = await todosDb.insert(request.body);
  return reply.status(201).send(newtodo);
}

async function gettodos(request, reply) {
  const todos = await todosDb.findAll();
  return reply.send(todos);
}

async function gettodoById(request, reply) {
  const todo = await todosDb.findById(request.params.id);
  if (!todo) {
    return reply.status(404).send({ message: "todo not found." });
  }
  return reply.send(todo);
}

async function updatetodo(request, reply) {
  const updatedtodo = await todosDb.update(
    request.params.id,
    request.body,
  );
  if (!updatedtodo) {
    return reply.status(404).send({ message: "todo not found." });
  }
  return reply.send(updatedtodo);
}

async function deletetodo(request, reply) {
  const numRemoved = await todosDb.delete(request.params.id);
  if (numRemoved === 0) {
    return reply.status(404).send({ message: "todo not found." });
  }
  return reply.status(204).send();
}

// Routes Mapping with validation schemas
function routes(app) {
  app.post("/todos", { schema: { body: todoSchema } }, createtodo);
  app.get("/todos", gettodos);
  app.get(
    "/todos/:id",
    { schema: { params: idParamSchema } },
    gettodoById,
  );
  app.put(
    "/todos/:id",
    { schema: { params: idParamSchema, body: todoSchema } },
    updatetodo,
  );
  app.delete(
    "/todos/:id",
    { schema: { params: idParamSchema } },
    deletetodo,
  );
}

exports.routes = routes;
