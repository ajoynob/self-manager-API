// In-memory "database"
let researches = [];
let idCounter = 1;

// Schemas for validation
const researchSchema = {
  type: "object",
  required: ["title", "field", "description"],
  properties: {
    title: { type: "string" },
    field: { type: "string" },
    description: { type: "string" },
    start_date: { type: "string" },
    end_date: { type: "string" },
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
 * Create a new research
 */
async function createresearch(request, response) {
  const { title, field, description, start_date, end_date, status } = request.body;

  if (!title || !field || !description) {
    return response
      .status(400)
      .send({ message: "title, field, and description are required." });
  }

  const newresearch = {
    id: idCounter++,
    title,
    field,
    description,
    start_date,
    end_date,
    status,
  };

  researches.push(newresearch);
  return response.status(201).send(newresearch);
}

/**
 * Get all researchs
 */
async function getresearches(request, response) {
  return response.send(researches);
}

/**
 * Get a single research by ID
 */
async function getresearchById(request, response) {
  const research = researches.find((c) => c.id === parseInt(request.params.id));

  if (!research) {
    return response.status(404).send({ message: "research not found." });
  }

  return response.send(research);
}

/**
 * Update a research by ID
 */
async function updateresearch(request, response) {
  const { title, field, description, start_date, end_date, status } = request.body;
  const research = researches.find((c) => c.id === parseInt(request.params.id));

  if (!research) {
    return response.status(404).send({ message: "research not found." });
  }

  Object.assign(research, {
    title: title || research.title,
    field: field || research.field,
    description: description || research.description,
    start_date: start_date || research.start_date,
    end_date: end_date || research.end_date,
    status: status || research.status,
  });
  return response.send(research);
}

/**
 * Delete a research by ID
 */
async function deleteresearch(request, response) {
  const researchIndex = researches.findIndex(
    (c) => c.id === parseInt(request.params.id),
  );

  if (researchIndex === -1) {
    return response.status(404).send({ message: "research not found." });
  }

  researches.splice(researchIndex, 1);
  return response.status(204).send();
}

// Routes Mapping
function routes(app) {
  // app.post("/researches", createresearch);
  // app.get("/researches", getresearches);
  // app.get("/researches/:id", getresearchById);
  // app.put("/researches/:id", updateresearch);
  // app.delete("/researches/:id", deleteresearch);

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
