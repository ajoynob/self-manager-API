// In-memory "database"
let inventor = [];
let idCounter = 1;

// Handlers

/**
 * Create a new Inventor
 */
async function createInventor(request, response) {
  const {
    item_name,
    description,
    quantity,
    price,
    category,
    supplier,
    purchase_date,
    expiry_date,
    location
  } = request.body;

  if (!item_name || !description || !quantity) {
    return response
      .status(400)
      .send({ message: "Item Name, Description, and Quantity are required." });
  }

  const newInventor = {
    id: idCounter++,
    item_name,
    description,
    quantity,
    price,
    category,
    supplier,
    purchase_date,
    expiry_date,
    location,
  };

  inventor.push(newInventor);
  return response.status(201).send(newInventor);
}

/**
 * Get all inventor
 */
async function getInventor(request, response) {
  return response.send(inventor);
}

/**
 * Get a single Inventor by ID
 */
async function getInventorById(request, response) {
  const Inventor = inventor.find((c) => c.id === parseInt(request.params.id));

  if (!Inventor) {
    return response.status(404).send({ message: "Inventor not found." });
  }

  return response.send(Inventor);
}

/**
 * Update a Inventor by ID
 */
async function updateInventor(request, response) {
  const {
    item_name,
    description,
    quantity,
    price,
    category,
    supplier,
    purchase_date,
    expiry_date,
    location
  } = request.body;
  const Inventor = inventor.find((c) => c.id === parseInt(request.params.id));

  if (!Inventor) {
    return response.status(404).send({ message: "Inventor not found." });
  }

  Object.assign(Inventor, {
    item_name: item_name || Inventor.item_name,
    description: description || Inventor.description,
    quantity: quantity || Inventor.quantity,
    price: price || Inventor.price,
    category: category || Inventor.category,
    supplier: supplier || Inventor.supplier,
    purchase_date: purchase_date || Inventor.purchase_date,
    expiry_date: expiry_date || Inventor.expiry_date,
    location: location || Inventor.location,
  });
  return response.send(Inventor);
}

/**
 * Delete a Inventor by ID
 */
async function deleteInventor(request, response) {
  const InventorIndex = inventor.findIndex(
    (c) => c.id === parseInt(request.params.id)
  );

  if (InventorIndex === -1) {
    return response.status(404).send({ message: "Inventor not found." });
  }

  inventor.splice(InventorIndex, 1);
  return response.status(204).send();
}

// Routes Mapping
function routes(app) {
  app.post("/inventor", createInventor);
  app.get("/inventor", getInventor);
  app.get("/inventor/:id", getInventorById);
  app.put("/inventor/:id", updateInventor);
  app.delete("/inventor/:id", deleteInventor);
}

exports.routes = routes;
