const dbHelper = require("../dbHelper");

// Schemas for validation
const inventorSchema = {
  type: "object",
  required: ["item_name", "description", "quantity"],
  properties: {
    item_name: { type: "string" },
    description: { type: "string" },
    quantity: { type: "string", format: "quantity" },
    price: { type: "string" },
    catagory: { type: "string" },
    supplier: { type: "string" },
    purchase_date: { type: "string"},
    expiry_date: {type: "string"},
    location: {type: "string"},
  },
};

const idParamSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
};

const inventorsDb = dbHelper("inventors");

// Handlers
async function createinventor(request, reply) {
  const newinventor = await inventorsDb.insert(request.body);
  return reply.status(201).send(newinventor);
}

async function getinventors(request, reply) {
  const inventors = await inventorsDb.findAll();
  return reply.send(inventors);
}

async function getinventorById(request, reply) {
  const inventor = await inventorsDb.findById(request.params.id);
  if (!inventor) {
    return reply.status(404).send({ message: "inventor not found." });
  }
  return reply.send(inventor);
}

async function updateinventor(request, reply) {
  const updatedinventor = await inventorsDb.update(
    request.params.id,
    request.body,
  );
  if (!updatedinventor) {
    return reply.status(404).send({ message: "inventor not found." });
  }
  return reply.send(updatedinventor);
}

async function deleteinventor(request, reply) {
  const numRemoved = await inventorsDb.delete(request.params.id);
  if (numRemoved === 0) {
    return reply.status(404).send({ message: "inventor not found." });
  }
  return reply.status(204).send();
}

// Routes Mapping with validation schemas
function routes(app) {
  app.post("/inventors", { schema: { body: inventorSchema } }, createinventor);
  app.get("/inventors", getinventors);
  app.get(
    "/inventors/:id",
    { schema: { params: idParamSchema } },
    getinventorById,
  );
  app.put(
    "/inventors/:id",
    { schema: { params: idParamSchema, body: inventorSchema } },
    updateinventor,
  );
  app.delete(
    "/inventors/:id",
    { schema: { params: idParamSchema } },
    deleteinventor,
  );
}

exports.routes = routes;
