// In-memory "database"
let researches = [];
let idCounter = 1;

// Handlers

/**
 * Create a new Researches
 */
async function createResearches(request, response) {
  const { title, field, description, start_date, end_date, status } = request.body;

  if (!title || !field || !description) {
    return response
      .status(400)
      .send({ message: "Title, Field, and Description are required." });
  }

  const newResearches = {
    id: idCounter++,
    title,
    field,
    description,
    start_date,
    end_date,
    status,
  };

  researches.push(newResearches);
  return response.status(201).send(newResearches);
}

/**
 * Get all researches
 */
async function getResearches(request, response) {
  return response.send(researches);
}

/**
 * Get a single Researches by ID
 */
async function getResearchesById(request, response) {
  const Researches = researches.find((c) => c.id === parseInt(request.params.id));

  if (!Researches) {
    return response.status(404).send({ message: "Researches not found." });
  }

  return response.send(Researches);
}

/**
 * Update a Researches by ID
 */
async function updateResearches(request, response) {
  const { title, field, description, start_date, end_date, status } = request.body;
  const Researches = researches.find((c) => c.id === parseInt(request.params.id));

  if (!Researches) {
    return response.status(404).send({ message: "Researches not found." });
  }

  Object.assign(Researches, {
    title: title || Researches.title,
    field: field || Researches.field,
    description: description || Researches.description,
    start_date: start_date || Researches.start_date,
    end_date: end_date || Researches.end_date,
    status: status || Researches.status,
  });
  return response.send(Researches);
}

/**
 * Delete a Researches by ID
 */
async function deleteResearches(request, response) {
  const ResearchesIndex = researches.findIndex(
    (c) => c.id === parseInt(request.params.id)
  );

  if (ResearchesIndex === -1) {
    return response.status(404).send({ message: "Researches not found." });
  }

  researches.splice(ResearchesIndex, 1);
  return response.status(204).send();
}

// Routes Mapping
function routes(app) {
  app.post("/researches", createResearches);
  app.get("/researches", getResearches);
  app.get("/researches/:id", getResearchesById);
  app.put("/researches/:id", updateResearches);
  app.delete("/researches/:id", deleteResearches);
}

exports.routes = routes;
