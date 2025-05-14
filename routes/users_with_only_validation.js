// In-memory "database"
let users = [];
let idCounter = 1;

// Schemas for validation
const userSchema = {
  type: "object",
  required: ["name", "password", "email"],
  properties: {
    name: { type: "string" },
    password: { type: "string" },
    email: { type: "string", format: "email",errorMessage: {
      format: 'Wrong email' // all constraints except required
    } },
    role: { type: "string" },
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
 * Create a new user
 */
async function createuser(request, response) {
  const { name, password, email, role } = request.body;

  if (!name || !password || !email) {
    return response
      .status(400)
      .send({ message: "Name, password, and email are required." });
  }

  const newuser = {
    id: idCounter++,
    name,
    password,
    email,
    role,
  };

  users.push(newuser);
  return response.status(201).send(newuser);
}

/**
 * Get all users
 */
async function getusers(request, response) {
  return response.send(users);
}

/**
 * Get a single user by ID
 */
async function getuserById(request, response) {
  const user = users.find((c) => c.id === parseInt(request.params.id));

  if (!user) {
    return response.status(404).send({ message: "user not found." });
  }

  return response.send(user);
}

/**
 * Update a user by ID
 */
async function updateuser(request, response) {
  const { name, password, email, role } = request.body;
  const user = users.find((c) => c.id === parseInt(request.params.id));

  if (!user) {
    return response.status(404).send({ message: "user not found." });
  }

  Object.assign(user, {
    name: name || user.name,
    password: password || user.password,
    email: email || user.email,
    role: role || user.role,
  });
  return response.send(user);
}

/**
 * Delete a user by ID
 */
async function deleteuser(request, response) {
  const userIndex = users.findIndex(
    (c) => c.id === parseInt(request.params.id),
  );

  if (userIndex === -1) {
    return response.status(404).send({ message: "user not found." });
  }

  users.splice(userIndex, 1);
  return response.status(204).send();
}

// Routes Mapping
function routes(app) {
  // app.post("/users", createuser);
  // app.get("/users", getusers);
  // app.get("/users/:id", getuserById);
  // app.put("/users/:id", updateuser);
  // app.delete("/users/:id", deleteuser);

  app.post("/users", { schema: { body: userSchema } }, createuser);
  app.get("/users", getusers);
  app.get(
    "/users/:id",
    { schema: { params: idParamSchema } },
    getuserById,
  );
  app.put(
    "/users/:id",
    { schema: { params: idParamSchema, body: userSchema } },
    updateuser,
  );
  app.delete(
    "/users/:id",
    { schema: { params: idParamSchema } },
    deleteuser,
  );
}

exports.routes = routes;
