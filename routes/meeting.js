const dbHelper = require("../dbHelper");

// Schemas for validation
const meetingSchema = {
  type: "object",
  required: ["title", "description", "date", "time"],
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    date:{ type: "string"},
    time: { type: "string" },
    location: { type: "string" },
    participants: { type: "string" },
    status: { type: "string"},
  },
};

const idParamSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
};

const meetingsDb = dbHelper("meetings");

// Handlers
async function createmeeting(request, reply) {
  const newmeeting = await meetingsDb.insert(request.body);
  return reply.status(201).send(newmeeting);
}

async function getmeetings(request, reply) {
  const meetings = await meetingsDb.findAll();
  return reply.send(meetings);
}

async function getmeetingById(request, reply) {
  const meeting = await meetingsDb.findById(request.params.id);
  if (!meeting) {
    return reply.status(404).send({ message: "meeting not found." });
  }
  return reply.send(meeting);
}

async function updatemeeting(request, reply) {
  const updatedmeeting = await meetingsDb.update(
    request.params.id,
    request.body,
  );
  if (!updatedmeeting) {
    return reply.status(404).send({ message: "meeting not found." });
  }
  return reply.send(updatedmeeting);
}

async function deletemeeting(request, reply) {
  const numRemoved = await meetingsDb.delete(request.params.id);
  if (numRemoved === 0) {
    return reply.status(404).send({ message: "meeting not found." });
  }
  return reply.status(204).send();
}

// Routes Mapping with validation schemas
function routes(app) {
  app.post("/meetings", { schema: { body: meetingSchema } }, createmeeting);
  app.get("/meetings", getmeetings);
  app.get(
    "/meetings/:id",
    { schema: { params: idParamSchema } },
    getmeetingById,
  );
  app.put(
    "/meetings/:id",
    { schema: { params: idParamSchema, body: meetingSchema } },
    updatemeeting,
  );
  app.delete(
    "/meetings/:id",
    { schema: { params: idParamSchema } },
    deletemeeting,
  );
}

exports.routes = routes;
