const dbHelper = require("../dbHelper");

// Schemas for validation
const medicineSchema = {
  type: "object",
  required: ["name", "dosage", "frequency"],
  properties: {
    name: { type: "string" },
    dosage: { type: "string" },
    frequency: { type: "string" },
    start_date: { type: "string" },
    end_date: { type: "string" },
    notes: { type: "string" },
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

const medicinesDb = dbHelper("medicines");

// Handlers
async function createmedicine(request, reply) {
  const newmedicine = await medicinesDb.insert(request.body);
  return reply.status(201).send(newmedicine);
}

async function getmedicines(request, reply) {
  const medicines = await medicinesDb.findAll();
  return reply.send(medicines);
}

async function getmedicineById(request, reply) {
  const medicine = await medicinesDb.findById(request.params.id);
  if (!medicine) {
    return reply.status(404).send({ message: "medicine not found." });
  }
  return reply.send(medicine);
}

async function updatemedicine(request, reply) {
  const updatedmedicine = await medicinesDb.update(
    request.params.id,
    request.body,
  );
  if (!updatedmedicine) {
    return reply.status(404).send({ message: "medicine not found." });
  }
  return reply.send(updatedmedicine);
}

async function deletemedicine(request, reply) {
  const numRemoved = await medicinesDb.delete(request.params.id);
  if (numRemoved === 0) {
    return reply.status(404).send({ message: "medicine not found." });
  }
  return reply.status(204).send();
}

// Routes Mapping with validation schemas
function routes(app) {
  app.post("/medicines", { schema: { body: medicineSchema } }, createmedicine);
  app.get("/medicines", getmedicines);
  app.get(
    "/medicines/:id",
    { schema: { params: idParamSchema } },
    getmedicineById,
  );
  app.put(
    "/medicines/:id",
    { schema: { params: idParamSchema, body: medicineSchema } },
    updatemedicine,
  );
  app.delete(
    "/medicines/:id",
    { schema: { params: idParamSchema } },
    deletemedicine,
  );
}

exports.routes = routes;
