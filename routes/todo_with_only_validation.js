// In-memory "database"
let todos = [];
let idCounter = 1;

// Schemas for validation
const todoSchema = {
  type: "object",
  required: ["title", "description", "due_date"],
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    due_date: { type: "string" },
    priority: { type: "string" },
    status: { type: "string" },
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
 * Create a new todo
 */
async function createtodo(request, response) {
  const { title, description, due_date, priority, status } = request.body;

  if (!title || !description || !due_date) {
    return response
      .status(400)
      .send({ message: "title, description, and due_date are required." });
  }

  const newtodo = {
    id: idCounter++,
    title,
    description,
    due_date,
    priority,
    status,
  };

  todos.push(newtodo);
  return response.status(201).send(newtodo);
}

/**
 * Get all todos
 */
async function gettodos(request, response) {
  return response.send(todos);
}

/**
 * Get a single todo by ID
 */
async function gettodoById(request, response) {
  const todo = todos.find((c) => c.id === parseInt(request.params.id));

  if (!todo) {
    return response.status(404).send({ message: "todo not found." });
  }

  return response.send(todo);
}

/**
 * Update a todo by ID
 */
async function updatetodo(request, response) {
  const { title, description, due_date, priority, status } = request.body;
  const todo = todos.find((c) => c.id === parseInt(request.params.id));

  if (!todo) {
    return response.status(404).send({ message: "todo not found." });
  }

  Object.assign(todo, {
    title: title || todo.title,
    description: description || todo.description,
    due_date: due_date || todo.due_date,
    priority: priority || todo.priority,
    status: status || todo.status,
  });
  return response.send(todo);
}

/**
 * Delete a todo by ID
 */
async function deletetodo(request, response) {
  const todoIndex = todos.findIndex(
    (c) => c.id === parseInt(request.params.id),
  );

  if (todoIndex === -1) {
    return response.status(404).send({ message: "todo not found." });
  }

  todos.splice(todoIndex, 1);
  return response.status(204).send();
}

// Routes Mapping
function routes(app) {
  // app.post("/todos", createtodo);
  // app.get("/todos", gettodos);
  // app.get("/todos/:id", gettodoById);
  // app.put("/todos/:id", updatetodo);
  // app.delete("/todos/:id", deletetodo);

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
