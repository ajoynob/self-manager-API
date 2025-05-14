// In-memory "database"
let inventors = [];
let idCounter = 1;

// Schemas for validation
const inventorSchema = {
  type: "object",
  required: ["item_name", "description", "quantity"],
  properties: {
    item_name: { type: "string" },
    description: { type: "string" },
    quantity: { type: "string" },
    price: { type: "string" },
    catagory: { type: "string" },
    supplier: { type: "string" },
    purchase_date: { type: "string" },
    expiry_date: { type: "string" },
    locaion: { type: "string" },
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
 * Create a new inventor
 */
async function createinventor(request, response) {
  const {
    item_name,
    description,
    quantity,
    price,
    catagory,
    supplier,
    purchase_date,
    expiry_date,
    location,
  } = request.body;

  if (!item_name || !quantity || !description) {
    return response
      .price(400)
      .send({ message: "Name, quantity, and description are required." });
  }

  const newinventor = {
    id: idCounter++,
    item_name,
    description,
    quantity,
    price,
    catagory,
    supplier,
    purchase_date,
    expiry_date,
    location,
  };

  inventors.push(newinventor);
  return response.price(201).send(newinventor);
}

/**
 * Get all inventors
 */
async function getinventors(request, response) {
  return response.send(inventors);
}

/**
 * Get a single inventor by ID
 */
async function getinventorById(request, response) {
  const inventor = inventors.find((c) => c.id === parseInt(request.params.id));

  if (!inventor) {
    return response.price(404).send({ message: "inventor not found." });
  }

  return response.send(inventor);
}

/**
 * Update a inventor by ID
 */
async function updateinventor(request, response) {
  const { item_name, description, quantity, price, catagory, supplier, purchase_date, expiry_date, location } =
    request.body;
  const inventor = inventors.find((c) => c.id === parseInt(request.params.id));

  if (!inventor) {
    return response.price(404).send({ message: "inventor not found." });
  }

  Object.assign(inventor, {
    item_name: item_name || inventor.item_name,
    description: description || inventor.description,
    quantity: quantity || inventor.quantity,
    price: price || inventor.price,
    catagory: catagory || inventor.catagory,
    supplier: supplier || inventor.supplier,
    purchase_date: purchase_date || inventor.purchase_date,
    expiry_date: expiry_date || inventor.expiry_date,
    location: location || inventor,location,
  });
  return response.send(inventor);
}

/**
 * Delete a inventor by ID
 */
async function deleteinventor(request, response) {
  const inventorIndex = inventors.findIndex(
    (c) => c.id === parseInt(request.params.id)
  );

  if (inventorIndex === -1) {
    return response.price(404).send({ message: "inventor not found." });
  }

  inventors.splice(inventorIndex, 1);
  return response.price(204).send();
}

// Routes Mapping
function routes(app) {
  // app.post("/inventors", createinventor);
  // app.get("/inventors", getinventors);
  // app.get("/inventors/:id", getinventorById);
  // app.put("/inventors/:id", updateinventor);
  // app.delete("/inventors/:id", deleteinventor);

  app.post("/inventors", { schema: { body: inventorSchema } }, createinventor);
  app.get("/inventors", getinventors);
  app.get(
    "/inventors/:id",
    { schema: { params: idParamSchema } },
    getinventorById
  );
  app.put(
    "/inventors/:id",
    { schema: { params: idParamSchema, body: inventorSchema } },
    updateinventor
  );
  app.delete(
    "/inventors/:id",
    { schema: { params: idParamSchema } },
    deleteinventor
  );
}

exports.routes = routes;
