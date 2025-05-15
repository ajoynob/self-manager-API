const dbHelper = require("../dbHelper");

// Schemas for validation
const researchSchema = {
  type: "object",
  required: ["title", "field", "description"],
  properties: {
    title: { type: "string" },
    field: { type: "string" },
    description: { type: "string"},
    start_date: { type: "string" },
    end_date: { type: "string" },
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

const researchesDb = dbHelper("researches");

// Handlers
async function createresearch(request, reply) {
  const newresearch = await researchesDb.insert(request.body);
  return reply.status(201).send(newresearch);
}

async function getresearches(request, reply) {
  const researches = await researchesDb.findAll();
  return reply.send(researches);
}

async function getresearchById(request, reply) {
  const research = await researchesDb.findById(request.params.id);
  if (!research) {
    return reply.status(404).send({ message: "research not found." });
  }
  return reply.send(research);
}

async function updateresearch(request, reply) {
  const updatedresearch = await researchesDb.update(
    request.params.id,
    request.body,
  );
  if (!updatedresearch) {
    return reply.status(404).send({ message: "research not found." });
  }
  return reply.send(updatedresearch);
}

async function deleteresearch(request, reply) {
  const numRemoved = await researchesDb.delete(request.params.id);
  if (numRemoved === 0) {
    return reply.status(404).send({ message: "research not found." });
  }
  return reply.status(204).send();
}

// Routes Mapping with validation schemas
function routes(app) {
  app.post("/researches", { schema: { body: researchSchema } }, createresearch);
  app.get("/researches", getresearches);
  app.get(
    "/researches/:id",
    { schema: { params: idParamSchema } },
    getresearchById,
  );
  app.put(
    "/researches/:id",
    { schema: { params: idParamSchema, body: researchSchema } },
    updateresearch,
  );
  app.delete(
    "/researches/:id",
    { schema: { params: idParamSchema } },
    deleteresearch,
  );
}

exports.routes = routes;
