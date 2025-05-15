const dbHelper = require("../dbHelper");

// Schemas for validation
const clothSchema = {
  type: "object",
  required: ["item_name", "size", "color"],
  properties: {
    item_name: { type: "string" },
    size: { type: "string" },
    color: { type: "string"},
    material: { type: "string" },
    purchase_date: { type: "string" },
    price: { type: "string" },
    catagory: { type: "string"},
    notes: {type: "string"},
  },
};

const idParamSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
};

const clothsDb = dbHelper("cloths");

// Handlers
async function createcloth(request, reply) {
  const newcloth = await clothsDb.insert(request.body);
  return reply.status(201).send(newcloth);
}

async function getcloths(request, reply) {
  const cloths = await clothsDb.findAll();
  return reply.send(cloths);
}

async function getclothById(request, reply) {
  const cloth = await clothsDb.findById(request.params.id);
  if (!cloth) {
    return reply.status(404).send({ message: "cloth not found." });
  }
  return reply.send(cloth);
}

async function updatecloth(request, reply) {
  const updatedcloth = await clothsDb.update(
    request.params.id,
    request.body,
  );
  if (!updatedcloth) {
    return reply.status(404).send({ message: "cloth not found." });
  }
  return reply.send(updatedcloth);
}

async function deletecloth(request, reply) {
  const numRemoved = await clothsDb.delete(request.params.id);
  if (numRemoved === 0) {
    return reply.status(404).send({ message: "cloth not found." });
  }
  return reply.status(204).send();
}

// Routes Mapping with validation schemas
function routes(app) {
  app.post("/cloths", { schema: { body: clothSchema } }, createcloth);
  app.get("/cloths", getcloths);
  app.get(
    "/cloths/:id",
    { schema: { params: idParamSchema } },
    getclothById,
  );
  app.put(
    "/cloths/:id",
    { schema: { params: idParamSchema, body: clothSchema } },
    updatecloth,
  );
  app.delete(
    "/cloths/:id",
    { schema: { params: idParamSchema } },
    deletecloth,
  );
}

exports.routes = routes;
