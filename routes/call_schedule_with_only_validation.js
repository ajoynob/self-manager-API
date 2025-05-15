// In-memory "database"
let call_schedules = [];
let idCounter = 1;

// Schemas for validation
const call_scheduleSchema = {
  type: "object",
  required: ["contact_id", "call_date", "call_time"],
  properties: {
    name: { type: "string" },
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
    id: { type: "integer", minimum: 1 },
  },
  required: ["id"],
};

// Handlers

/**
 * Create a new call_schedule
 */
async function createcall_schedule(request, response) {
  const { name, call_date, call_time, call_purpose, repeat_interval, status, notes } =
    request.body;

  if (!name || !call_date || !call_time) {
    return response
      .status(400)
      .send({ message: "Name, Call date, and Call time are required." });
  }

  const newcall_schedule = {
    id: idCounter++,
    name,
    call_date,
    call_time,
    call_purpose,
    repeat_interval,
    status,
    notes,
  };

  call_schedules.push(newcall_schedule);
  return response.status(201).send(newcall_schedule);
}

/**
 * Get all call_schedules
 */
async function getcall_schedules(request, response) {
  return response.send(call_schedules);
}

/**
 * Get a single call_schedule by ID
 */
async function getcall_scheduleById(request, response) {
  const call_schedule = call_schedules.find(
    (c) => c.id === parseInt(request.params.id)
  );

  if (!call_schedule) {
    return response.status(404).send({ message: "call_schedule not found." });
  }

  return response.send(call_schedule);
}

/**
 * Update a call_schedule by ID
 */
async function updatecall_schedule(request, response) {
  const { name, call_date, call_time, call_purpose, repeat_interval, status, notes } =
    request.body;
  const call_schedule = call_schedules.find(
    (c) => c.id === parseInt(request.params.id)
  );

  if (!call_schedule) {
    return response.status(404).send({ message: "call_schedule not found." });
  }

  Object.assign(call_schedule, {
    name: name || call_schedule.name,
    call_date: call_date || call_schedule.call_date,
    call_time: call_time || call_schedule.call_time,
    call_purpose: call_purpose || call_schedule.call_purpose,
    repeat_interval: repeat_interval || call_schedule.repeat_interval,
    status: status || call_schedule.status,
    notes: notes || call_schedule.notes,
  });
  return response.send(call_schedule);
}

/**
 * Delete a call_schedule by ID
 */
async function deletecall_schedule(request, response) {
  const call_scheduleIndex = call_schedules.findIndex(
    (c) => c.id === parseInt(request.params.id)
  );

  if (call_scheduleIndex === -1) {
    return response.status(404).send({ message: "call_schedule not found." });
  }

  call_schedules.splice(call_scheduleIndex, 1);
  return response.status(204).send();
}

// Routes Mapping
function routes(app) {
  // app.post("/call_schedules", createcall_schedule);
  // app.get("/call_schedules", getcall_schedules);
  // app.get("/call_schedules/:id", getcall_scheduleById);
  // app.put("/call_schedules/:id", updatecall_schedule);
  // app.delete("/call_schedules/:id", deletecall_schedule);

  app.post(
    "/call_schedules",
    { schema: { body: call_scheduleSchema } },
    createcall_schedule
  );
  app.get("/call_schedules", getcall_schedules);
  app.get(
    "/call_schedules/:id",
    { schema: { params: idParamSchema } },
    getcall_scheduleById
  );
  app.put(
    "/call_schedules/:id",
    { schema: { params: idParamSchema, body: call_scheduleSchema } },
    updatecall_schedule
  );
  app.delete(
    "/call_schedules/:id",
    { schema: { params: idParamSchema } },
    deletecall_schedule
  );
}

exports.routes = routes;
