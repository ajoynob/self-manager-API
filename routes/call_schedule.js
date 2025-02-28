// In-memory "database"
let call_schedule = [];
let idCounter = 1;

// Handlers

/**
 * Create a new CallSchedule
 */
async function createCallSchedule(request, response) {
  const { contact_id, call_date, call_time, call_purpose, repeat_interval, status, notes } = request.body;

  if (!contact_id || !call_date || !call_time) {
    return response
      .status(400)
      .send({ message: "Contact ID, Call date, and Call time are required." });
  }

  const newCallSchedule = {
    id: idCounter++,
    contact_id,
    call_date,
    call_time,
    call_purpose,
    repeat_interval,
    status, 
    notes,
  };

  call_schedule.push(newCallSchedule);
  return response.status(201).send(newCallSchedule);
}

/**
 * Get all call_schedule
 */
async function getCallSchedule(request, response) {
  return response.send(call_schedule);
}

/**
 * Get a single CallSchedule by ID
 */
async function getCallScheduleById(request, response) {
  const CallSchedule = call_schedule.find((c) => c.id === parseInt(request.params.id));

  if (!CallSchedule) {
    return response.status(404).send({ message: "Call Schedule not found." });
  }

  return response.send(CallSchedule);
}

/**
 * Update a CallSchedule by ID
 */
async function updateCallSchedule(request, response) {
  const { contact_id, call_date, call_time, call_purpose, repeat_interval, status, notes } = request.body;
  const CallSchedule = call_schedule.find((c) => c.id === parseInt(request.params.id));

  if (!CallSchedule) {
    return response.status(404).send({ message: "Call Schedule not found." });
  }

  Object.assign(CallSchedule, {
    contact_id: contact_id || CallSchedule.contact_id, 
    call_date: call_date || CallSchedule.call_date, 
    call_time: call_time || CallSchedule.call_time, 
    call_purpose: call_purpose || CallSchedule.call_purpose, 
    repeat_interval: repeat_interval || CallSchedule.repeat_interval, 
    status: status || CallSchedule.status, 
    notes: notes || CallSchedule.notes,
   });
  return response.send(CallSchedule);
}

/**
 * Delete a CallSchedule by ID
 */
async function deleteCallSchedule(request, response) {
  const CallScheduleIndex = call_schedule.findIndex(
    (c) => c.id === parseInt(request.params.id),
  );

  if (CallScheduleIndex === -1) {
    return response.status(404).send({ message: "Call Schedule not found." });
  }

  call_schedule.splice(CallScheduleIndex, 1);
  return response.status(204).send();
}

// Routes Mapping
function routes(app) {
  app.post("/call_schedule", createCallSchedule);
  app.get("/call_schedule", getCallSchedule);
  app.get("/call_schedule/:id", getCallScheduleById);
  app.put("/call_schedule/:id", updateCallSchedule);
  app.delete("/call_schedule/:id", deleteCallSchedule);
}

exports.routes = routes;
