// In-memory "database"
let users = [];
let idCounter = 1;

// Handlers

/**
 * Create a new User
 */
async function createUser(request, response) {
  const { name, password, email, role } = request.body;

  if (!name || !password || !email) {
    return response
      .status(400)
      .send({ message: "Name, Password, and Email are required." });
  }

  const newUser = {
    id: idCounter++,
    name,
    password,
    email,
    role,
  };

  users.push(newUser);
  return response.status(201).send(newUser);
}

/**
 * Get all users
 */
async function getUsers(request, response) {
  return response.send(users);
}

/**
 * Get a single User by ID
 */
async function getUserById(request, response) {
  const User = users.find((c) => c.id === parseInt(request.params.id));

  if (!User) {
    return response.status(404).send({ message: "User not found." });
  }

  return response.send(User);
}

/**
 * Update a User by ID
 */
async function updateUser(request, response) {
  const { name, password, email, role,} = request.body;
  const User = users.find((c) => c.id === parseInt(request.params.id));

  if (!User) {
    return response.status(404).send({ message: "User not found." });
  }

  Object.assign(User, { name, password, email, role,});
  return response.send(User);
}

/**
 * Delete a User by ID
 */
async function deleteUser(request, response) {
  const UserIndex = users.findIndex(
    (c) => c.id === parseInt(request.params.id),
  );

  if (UserIndex === -1) {
    return response.status(404).send({ message: "User not found." });
  }

  users.splice(UserIndex, 1);
  return response.status(204).send();
}

// Routes Mapping
function routes(app) {
  app.post("/users", createUser);
  app.get("/users", getUsers);
  app.get("/users/:id", getUserById);
  app.put("/users/:id", updateUser);
  app.delete("/users/:id", deleteUser);
}

exports.routes = routes;
