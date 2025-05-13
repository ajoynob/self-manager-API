const dbHelper = require("../dbHelper");

// Schemas for validation
const photoSchema = {
  type: "object",
  required: ["title", "description", "url"],
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    url: { type: "string"},
    uploaded_by: { type: "string" },
    uploaded_date: { type: "string" },
    album: { type: "string" },
  },
};

const idParamSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
};

const photosDb = dbHelper("photos");

// Handlers
async function createphoto(request, reply) {
  const newphoto = await photosDb.insert(request.body);
  return reply.status(201).send(newphoto);
}

async function getphotos(request, reply) {
  const photos = await photosDb.findAll();
  return reply.send(photos);
}

async function getphotoById(request, reply) {
  const photo = await photosDb.findById(request.params.id);
  if (!photo) {
    return reply.status(404).send({ message: "photo not found." });
  }
  return reply.send(photo);
}

async function updatephoto(request, reply) {
  const updatedphoto = await photosDb.update(
    request.params.id,
    request.body,
  );
  if (!updatedphoto) {
    return reply.status(404).send({ message: "photo not found." });
  }
  return reply.send(updatedphoto);
}

async function deletephoto(request, reply) {
  const numRemoved = await photosDb.delete(request.params.id);
  if (numRemoved === 0) {
    return reply.status(404).send({ message: "photo not found." });
  }
  return reply.status(204).send();
}

// Routes Mapping with validation schemas
function routes(app) {
  app.post("/photos", { schema: { body: photoSchema } }, createphoto);
  app.get("/photos", getphotos);
  app.get(
    "/photos/:id",
    { schema: { params: idParamSchema } },
    getphotoById,
  );
  app.put(
    "/photos/:id",
    { schema: { params: idParamSchema, body: photoSchema } },
    updatephoto,
  );
  app.delete(
    "/photos/:id",
    { schema: { params: idParamSchema } },
    deletephoto,
  );
}

exports.routes = routes;
