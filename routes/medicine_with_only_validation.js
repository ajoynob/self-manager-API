// In-memory "database"
let medicines = [];
let idCounter = 1;

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
    notes: {type: "string" },
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
 * Create a new medicine
 */
async function createmedicine(request, response) {
  const { name, dosage, frequency, start_date, end_date, notes, status } = request.body;

  if (!name || !frequency || !dosage ) {
    return response
      .status(400)
      .send({ message: "name, dosage and frequency are required." });
  }

  const newmedicine = {
    id: idCounter++,
    name,
    dosage,
    frequency,
    start_date,
    end_date,
    notes,
    status,
  };

  medicines.push(newmedicine);
  return response.status(201).send(newmedicine);
}

/**
 * Get all medicines
 */
async function getmedicines(request, response) {
  return response.send(medicines);
}

/**
 * Get a single medicine by ID
 */
async function getmedicineById(request, response) {
  const medicine = medicines.find((c) => c.id === parseInt(request.params.id));

  if (!medicine) {
    return response.status(404).send({ message: "medicine not found." });
  }

  return response.send(medicine);
}

/**
 * Upfrequency a medicine by ID
 */
async function upfrequencymedicine(request, response) {
  const { name, dosage, frequency, start_date, end_date, notes, status } = request.body;
  const medicine = medicines.find((c) => c.id === parseInt(request.params.id));

  if (!medicine) {
    return response.status(404).send({ message: "medicine not found." });
  }

  Object.assign(medicine, {
    name: name || medicine.name,
    dosage: dosage || medicine.dosage,
    frequency: frequency || medicine.frequency,
    start_date: start_date || medicine.start_date,
    end_date: end_date || medicine.end_date,
    notes: notes || medicine.notes,
    status: status || medicine.status,
  });
  return response.send(medicine);
}

/**
 * Delete a medicine by ID
 */
async function deletemedicine(request, response) {
  const medicineIndex = medicines.findIndex(
    (c) => c.id === parseInt(request.params.id),
  );

  if (medicineIndex === -1) {
    return response.status(404).send({ message: "medicine not found." });
  }

  medicines.splice(medicineIndex, 1);
  return response.status(204).send();
}

// Routes Mapping
function routes(app) {
  // app.post("/medicines", createmedicine);
  // app.get("/medicines", getmedicines);
  // app.get("/medicines/:id", getmedicineById);
  // app.put("/medicines/:id", upfrequencymedicine);
  // app.delete("/medicines/:id", deletemedicine);

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
    upfrequencymedicine,
  );
  app.delete(
    "/medicines/:id",
    { schema: { params: idParamSchema } },
    deletemedicine,
  );
}

exports.routes = routes;
