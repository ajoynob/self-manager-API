const dbHelper = require("../dbHelper");

// Schemas for validation
const grocerieSchema = {
  type: "object",
  required: ["item_name", "quantity", "price"],
  properties: {
    item_name: { type: "string" },
    quantity: { type: "string" },
    price: { type: "string" },
    purchase: { type: "string" },
    purchase_date: { type: "string" },
    category: { type: "string" },
  },
};

const idParamSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
};

const groceriesDb = dbHelper("groceries");

// Handlers
async function creategrocerie(request, reply) {
  const newgrocerie = await groceriesDb.insert(request.body);
  return reply.status(201).send(newgrocerie);
}

async function getgroceries(request, reply) {
  const groceries = await groceriesDb.findAll();
  return reply.send(groceries);
}

async function getgrocerieById(request, reply) {
  const grocerie = await groceriesDb.findById(request.params.id);
  if (!grocerie) {
    return reply.status(404).send({ message: "grocerie not found." });
  }
  return reply.send(grocerie);
}

async function updategrocerie(request, reply) {
  const updatedgrocerie = await groceriesDb.update(
    request.params.id,
    request.body,
  );
  if (!updatedgrocerie) {
    return reply.status(404).send({ message: "grocerie not found." });
  }
  return reply.send(updatedgrocerie);
}

async function deletegrocerie(request, reply) {
  const numRemoved = await groceriesDb.delete(request.params.id);
  if (numRemoved === 0) {
    return reply.status(404).send({ message: "grocerie not found." });
  }
  return reply.status(204).send();
}

// Routes Mapping with validation schemas
function routes(app) {
  app.post("/groceries", { schema: { body: grocerieSchema } }, creategrocerie);
  app.get("/groceries", getgroceries);
  app.get(
    "/groceries/:id",
    { schema: { params: idParamSchema } },
    getgrocerieById,
  );
  app.put(
    "/groceries/:id",
    { schema: { params: idParamSchema, body: grocerieSchema } },
    updategrocerie,
  );
  app.delete(
    "/groceries/:id",
    { schema: { params: idParamSchema } },
    deletegrocerie,
  );
}

exports.routes = routes;
