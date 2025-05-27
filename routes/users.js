const dbHelper = require("../dbHelper");
const { sign } = require("../jwtHelper");

// Schemas for validation
const userSchema = {
  type: "object",
  required: ["name", "password", "email"],
  properties: {
    name: { type: "string" },
    password: { type: "string" },
    email: { type: "string", format: "email" },
    role: { type: "string" },
  },
};

const loginSchema = {
  type: "object",
  required: ["email", "password"],
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string" },
  },
};

const idParamSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
};

const usersDb = dbHelper("users");

// Handlers

async function loginUser(request, reply) {
  const { email, password } = request.body;
  const users = await usersDb.findAll();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) return reply.status(401).send({ message: "Invalid credentials" });

  const token = sign({ id: user.id, email: user.email });
  return reply.send({ token, name: user.name });
}

async function createuser(request, reply) {
  const newuser = await usersDb.insert(request.body);
  return reply.status(201).send(newuser);
}
async function getusers(request, reply) {
  const users = await usersDb.findAll();
  return reply.send(users);
}

async function getuserById(request, reply) {
  const user = await usersDb.findById(request.params.id);
  if (!user) {
    return reply.status(404).send({ message: "user not found." });
  }
  return reply.send(user);
}

async function updateuser(request, reply) {
  const updateduser = await usersDb.update(
    request.params.id,
    request.body,
  );
  if (!updateduser) {
    return reply.status(404).send({ message: "user not found." });
  }
  return reply.send(updateduser);
}

async function deleteuser(request, reply) {
  const numRemoved = await usersDb.delete(request.params.id);
  if (numRemoved === 0) {
    return reply.status(404).send({ message: "user not found." });
  }
  return reply.status(204).send();
}

// Routes Mapping with validation schemas
function routes(app) {
  app.post("/login", { schema: { body: loginSchema } }, loginUser);
  app.post("/register", { schema: { body: userSchema } }, createuser);
  app.post("/users", { schema: { body: userSchema } }, createuser);
  app.get("/users", getusers);
  app.get("/users/:id", { schema: { params: idParamSchema } }, getuserById);
  app.put("/users/:id", { schema: { params: idParamSchema, body: userSchema } }, updateuser);
  app.delete("/users/:id", { schema: { params: idParamSchema } }, deleteuser);
}

exports.routes = routes;
