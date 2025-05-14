// In-memory "database"
let meetings = [];
let idCounter = 1;

// Schemas for validation
const meetingSchema = {
  type: "object",
  required: ["title", "description", "date", "time"],
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    date: { type: "string" },
    time: { type: "string" },
    location: { type: "string" },
    participants: {type: "string" },
    status: { type: "string" },
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
 * Create a new meeting
 */
async function createmeeting(request, response) {
  const { title, description, date, time, location, participants, status } = request.body;

  if (!title || !date || !description || !time) {
    return response
      .status(400)
      .send({ message: "title, description, date and time are required." });
  }

  const newmeeting = {
    id: idCounter++,
    title,
    description,
    date,
    time,
    location,
    participants,
    status,
  };

  meetings.push(newmeeting);
  return response.status(201).send(newmeeting);
}

/**
 * Get all meetings
 */
async function getmeetings(request, response) {
  return response.send(meetings);
}

/**
 * Get a single meeting by ID
 */
async function getmeetingById(request, response) {
  const meeting = meetings.find((c) => c.id === parseInt(request.params.id));

  if (!meeting) {
    return response.status(404).send({ message: "meeting not found." });
  }

  return response.send(meeting);
}

/**
 * Update a meeting by ID
 */
async function updatemeeting(request, response) {
  const { title, description, date, time, location, participants, status } = request.body;
  const meeting = meetings.find((c) => c.id === parseInt(request.params.id));

  if (!meeting) {
    return response.status(404).send({ message: "meeting not found." });
  }

  Object.assign(meeting, {
    title: title || meeting.title,
    description: description || meeting.description,
    date: date || meeting.date,
    time: time || meeting.time,
    location: location || meeting.location,
    participants: participants || meeting.participants,
    status: status || meeting.status,
  });
  return response.send(meeting);
}

/**
 * Delete a meeting by ID
 */
async function deletemeeting(request, response) {
  const meetingIndex = meetings.findIndex(
    (c) => c.id === parseInt(request.params.id),
  );

  if (meetingIndex === -1) {
    return response.status(404).send({ message: "meeting not found." });
  }

  meetings.splice(meetingIndex, 1);
  return response.status(204).send();
}

// Routes Mapping
function routes(app) {
  // app.post("/meetings", createmeeting);
  // app.get("/meetings", getmeetings);
  // app.get("/meetings/:id", getmeetingById);
  // app.put("/meetings/:id", updatemeeting);
  // app.delete("/meetings/:id", deletemeeting);

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
