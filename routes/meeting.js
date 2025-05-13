// In-memory "database"
let meeting = [];
let idCounter = 1;

// Handlers

/**
 * Create a new Meeting
 */
async function createMeeting(request, response) {
  const { title, description, date, time, location, participants, status } = request.body;

  if (!title || !description || !date || !time) {
    return response
      .status(400)
      .send({ message: "Title, Description, Date and Time are required." });
  }

  const newMeeting = {
    id: idCounter++,
    title,
    description,
    date,
    time,
    location,
    participants, 
    status,
  };

  meeting.push(newMeeting);
  return response.status(201).send(newMeeting);
}

/**
 * Get all meeting
 */
async function getMeeting(request, response) {
  return response.send(meeting);
}

/**
 * Get a single Meeting by ID
 */
async function getMeetingById(request, response) {
  const Meeting = meeting.find((c) => c.id === parseInt(request.params.id));

  if (!Meeting) {
    return response.status(404).send({ message: "Meeting not found." });
  }

  return response.send(Meeting);
}

/**
 * Update a Meeting by ID
 */
async function updateMeeting(request, response) {
  const { title, description, date, time, location, participants, status } = request.body;
  const Meeting = meeting.find((c) => c.id === parseInt(request.params.id));

  if (!Meeting) {
    return response.status(404).send({ message: "Meeting not found." });
  }

  Object.assign(Meeting, {
     title: title || Meeting.title, 
     description: description || Meeting.description, 
     date: date || Meeting.date, 
     time: time || Meeting.time, 
     location: location || Meeting.location, 
     participants: participants || Meeting.participants, 
     status: status || Meeting.status,
     });
  return response.send(Meeting);
}

/**
 * Delete a Meeting by ID
 */
async function deleteMeeting(request, response) {
  const MeetingIndex = meeting.findIndex(
    (c) => c.id === parseInt(request.params.id),
  );

  if (MeetingIndex === -1) {
    return response.status(404).send({ message: "Meeting not found." });
  }

  meeting.splice(MeetingIndex, 1);
  return response.status(204).send();
}

// Routes Mapping
function routes(app) {
  app.post("/meeting", createMeeting);
  app.get("/meeting", getMeeting);
  app.get("/meeting/:id", getMeetingById);
  app.put("/meeting/:id", updateMeeting);
  app.delete("/meeting/:id", deleteMeeting);
}

exports.routes = routes;
