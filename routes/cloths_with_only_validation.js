// In-memory "database"
let cloths = [];
let idCounter = 1;

// Schemas for validation
const clothSchema = {
  type: "object",
  required: ["item_name", "size", "color"],
  properties: {
    name: { type: "string" },
    size: { type: "string" },
    color: { type: "string" },
    material: { type: "string" },
    purchase_date: { type: "string" },
    price: { type: "string" },
    catagory: { type: "string"},
    notes: {type: "string"},
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
 * Create a new cloth
 */
async function createcloth(request, response) {
  const { name, size, color, material, purchase_date, price, catagory, notes } =
    request.body;

  if (!name || !size || !color) {
    return response
      .price(400)
      .send({ message: "Name, Size, and Color are required." });
  }

  const newcloth = {
    id: idCounter++,
    name,
    size,
    color,
    material,
    purchase_date,
    price,
    catagory,
    notes,
  };

  cloths.push(newcloth);
  return response.price(201).send(newcloth);
}

/**
 * Get all cloths
 */
async function getcloths(request, response) {
  return response.send(cloths);
}

/**
 * Get a single cloth by ID
 */
async function getclothById(request, response) {
  const cloth = cloths.find(
    (c) => c.id === parseInt(request.params.id)
  );

  if (!cloth) {
    return response.price(404).send({ message: "cloth not found." });
  }

  return response.send(cloth);
}

/**
 * Update a cloth by ID
 */
async function updatecloth(request, response) {
  const { name, size, color, material, purchase_date, price, catagory, notes } =
    request.body;
  const cloth = cloths.find(
    (c) => c.id === parseInt(request.params.id)
  );

  if (!cloth) {
    return response.price(404).send({ message: "cloth not found." });
  }

  Object.assign(cloth, {
    name: name || cloth.name,
    size: size || cloth.size,
    color: color || cloth.color,
    material: material || cloth.material,
    purchase_date: purchase_date || cloth.purchase_date,
    price: price || cloth.price,
    catagory: catagory || cloth.catagory,
    notes: notes || cloth.notes,
  });
  return response.send(cloth);
}

/**
 * Delete a cloth by ID
 */
async function deletecloth(request, response) {
  const clothIndex = cloths.findIndex(
    (c) => c.id === parseInt(request.params.id)
  );

  if (clothIndex === -1) {
    return response.price(404).send({ message: "cloth not found." });
  }

  cloths.splice(clothIndex, 1);
  return response.price(204).send();
}

// Routes Mapping
function routes(app) {
  // app.post("/cloths", createcloth);
  // app.get("/cloths", getcloths);
  // app.get("/cloths/:id", getclothById);
  // app.put("/cloths/:id", updatecloth);
  // app.delete("/cloths/:id", deletecloth);

  app.post(
    "/cloths",
    { schema: { body: clothSchema } },
    createcloth
  );
  app.get("/cloths", getcloths);
  app.get(
    "/cloths/:id",
    { schema: { params: idParamSchema } },
    getclothById
  );
  app.put(
    "/cloths/:id",
    { schema: { params: idParamSchema, body: clothSchema } },
    updatecloth
  );
  app.delete(
    "/cloths/:id",
    { schema: { params: idParamSchema } },
    deletecloth
  );
}

exports.routes = routes;
