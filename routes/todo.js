// In-memory "database"
let todo = [];
let idCounter = 1;

// Handlers

/**
 * Create a new Todo
 */
async function createTodo(request, response) {
  const { title, description, due_date, priority, status } = request.body;

  if (!title || !description || !due_date) {
    return response
      .status(400)
      .send({ message: "Title, Description, and Due Date are required." });
  }

  const newTodo = {
    id: idCounter++,
    title,
    description,
    due_date,
    priority,
    status,
  };

  todo.push(newTodo);
  return response.status(201).send(newTodo);
}

/**
 * Get all todo
 */
async function getTodo(request, response) {
  return response.send(todo);
}

/**
 * Get a single Todo by ID
 */
async function getTodoById(request, response) {
  const Todo = todo.find((c) => c.id === parseInt(request.params.id));

  if (!Todo) {
    return response.status(404).send({ message: "Todo not found." });
  }

  return response.send(Todo);
}

/**
 * Update a Todo by ID
 */
async function updateTodo(request, response) {
  const { title, description, due_date, priority, status } = request.body;
  const Todo = todo.find((c) => c.id === parseInt(request.params.id));

  if (!Todo) {
    return response.status(404).send({ message: "Todo not found." });
  }

  Object.assign(Todo, {
    title: title || Todo.title,
    description: description || Todo.description,
    due_date: due_date || Todo.due_date,
    priority: priority || Todo.priority,
    status: status || Todo.status,
  });
  return response.send(Todo);
}

/**
 * Delete a Todo by ID
 */
async function deleteTodo(request, response) {
  const TodoIndex = todo.findIndex((c) => c.id === parseInt(request.params.id));

  if (TodoIndex === -1) {
    return response.status(404).send({ message: "Todo not found." });
  }

  todo.splice(TodoIndex, 1);
  return response.status(204).send();
}

// Routes Mapping
function routes(app) {
  app.post("/todo", createTodo);
  app.get("/todo", getTodo);
  app.get("/todo/:id", getTodoById);
  app.put("/todo/:id", updateTodo);
  app.delete("/todo/:id", deleteTodo);
}

exports.routes = routes;
