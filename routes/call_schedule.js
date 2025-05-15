const dbHelper = require("../dbHelper");

// Schemas for validation
const call_scheduleSchema = {
  type: "object",
  required: ["contact_id", "call_date", "call_time"],
  properties: {
    contact_id: { type: "string" },
    call_date: { type: "string" },
    call_time: { type: "string" },
    call_purpose: { type: "string" },
    repeat_interval: { type: "string" },
    status: { type: "string" },
    notes: { type: "string" },
  },
};

const idParamSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
};

const call_schedulesDb = dbHelper("call_schedules");

// Handlers
async function createcall_schedule(request, reply) {
  const newcall_schedule = await call_schedulesDb.insert(request.body);
  return reply.status(201).send(newcall_schedule);
}

async function getcall_schedules(request, reply) {
  const call_schedules = await call_schedulesDb.findAll();
  return reply.send(call_schedules);
}

async function getcall_scheduleById(request, reply) {
  const call_schedule = await call_schedulesDb.findById(request.params.id);
  if (!call_schedule) {
    return reply.status(404).send({ message: "call_schedule not found." });
  }
  return reply.send(call_schedule);
}

async function updatecall_schedule(request, reply) {
  const updatedcall_schedule = await call_schedulesDb.update(
    request.params.id,
    request.body,
  );
  if (!updatedcall_schedule) {
    return reply.status(404).send({ message: "call_schedule not found." });
  }
  return reply.send(updatedcall_schedule);
}

async function deletecall_schedule(request, reply) {
  const numRemoved = await call_schedulesDb.delete(request.params.id);
  if (numRemoved === 0) {
    return reply.status(404).send({ message: "call_schedule not found." });
  }
  return reply.status(204).send();
}

// Routes Mapping with validation schemas
function routes(app) {
  app.post("/call_schedules", { schema: { body: call_scheduleSchema } }, createcall_schedule);
  app.get("/call_schedules", getcall_schedules);
  app.get(
    "/call_schedules/:id",
    { schema: { params: idParamSchema } },
    getcall_scheduleById,
  );
  app.put(
    "/call_schedules/:id",
    { schema: { params: idParamSchema, body: call_scheduleSchema } },
    updatecall_schedule,
  );
  app.delete(
    "/call_schedules/:id",
    { schema: { params: idParamSchema } },
    deletecall_schedule,
  );
}

exports.routes = routes;
