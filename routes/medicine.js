// In-memory "database"
let medicine = [];
let idCounter = 1;

// Handlers

/**
 * Create a new Medicine
 */
async function createMedicine(request, response) {
  const { name, dosage, frequency, start_date, end_date, notes, status } = request.body;

  if (!name || !dosage || !frequency) {
    return response
      .status(400)
      .send({ message: "Name, Dosage, and Frequency are required." });
  }

  const newMedicine = {
    id: idCounter++,
    name,
    dosage,
    frequency,
    start_date,
    end_date,
    notes,
    status,
  };

  medicine.push(newMedicine);
  return response.status(201).send(newMedicine);
}

/**
 * Get all medicine
 */
async function getMedicine(request, response) {
  return response.send(medicine);
}

/**
 * Get a single Medicine by ID
 */
async function getMedicineById(request, response) {
  const Medicine = medicine.find((c) => c.id === parseInt(request.params.id));

  if (!Medicine) {
    return response.status(404).send({ message: "Medicine not found." });
  }

  return response.send(Medicine);
}

/**
 * Update a Medicine by ID
 */
async function updateMedicine(request, response) {
  const { name, dosage, frequency, start_date, end_date, notes, status } = request.body;
  const Medicine = medicine.find((c) => c.id === parseInt(request.params.id));

  if (!Medicine) {
    return response.status(404).send({ message: "Medicine not found." });
  }

  Object.assign(Medicine, {
    name: name || Medicine.name,
    dosage: dosage || Medicine.dosage,
    frequency: frequency || Medicine.frequency,
    start_date: start_date || Medicine.start_date,
    end_date: end_date || Medicine.end_date,
    notes: notes || Medicine.notes,
    status: status || Medicine.status,
  });
  return response.send(Medicine);
}

/**
 * Delete a Medicine by ID
 */
async function deleteMedicine(request, response) {
  const MedicineIndex = medicine.findIndex(
    (c) => c.id === parseInt(request.params.id)
  );

  if (MedicineIndex === -1) {
    return response.status(404).send({ message: "Medicine not found." });
  }

  medicine.splice(MedicineIndex, 1);
  return response.status(204).send();
}

// Routes Mapping
function routes(app) {
  app.post("/medicine", createMedicine);
  app.get("/medicine", getMedicine);
  app.get("/medicine/:id", getMedicineById);
  app.put("/medicine/:id", updateMedicine);
  app.delete("/medicine/:id", deleteMedicine);
}

exports.routes = routes;
