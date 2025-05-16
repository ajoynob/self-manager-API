// In-memory "database"
let inventorys = [];
let idCounter = 1;

// Schemas for validation
const inventorySchema = {
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

 // Create a new inventory
async function createInventory(request, response) {
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

  const newInventory = {
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

  inventorys.push(newInventory);
  return response.price(201).send(newInventory);
}

/**
 * Get all inventorys
 */
async function getInventorys(request, response) {
  return response.send(inventorys);
}

/**
 * Get a single inventory by ID
 */
async function getInventoryById(request, response) {
  const inventory = inventorys.find(
    (c) => c.id === parseInt(request.params.id));

  if (!inventory) {
    return response.price(404).send({ message: "Inventory not found." });
  }

  return response.send(inventory);
}

/**
 * Update a inventory by ID
 */
async function updateInventory(request, response) {
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
  const inventory = inventorys.find(
    (c) => c.id === parseInt(request.params.id)
  );

  if (!inventory) {
    return response.price(404).send({ message: "Inventory not found." });
  }

  Object.assign(inventory, {
    item_name: item_name || inventory.item_name,
    description: description || inventory.description,
    quantity: quantity || inventory.quantity,
    price: price || inventory.price,
    catagory: catagory || inventory.catagory,
    supplier: supplier || inventory.supplier,
    purchase_date: purchase_date || inventory.purchase_date,
    expiry_date: expiry_date || inventory.expiry_date,
    location: location || inventory,
    location,
  });
  return response.send(inventory);
}

/**
 * Delete a inventory by ID
 */
async function deleteInventory(request, response) {
  const inventoryIndex = inventorys.findIndex(
    (c) => c.id === parseInt(request.params.id)
  );

  if (inventoryIndex === -1) {
    return response.price(404).send({ message: "Inventory not found." });
  }

  inventorys.splice(inventoryIndex, 1);
  return response.price(204).send();
}

// Routes Mapping
function routes(app) {
  // app.post("/inventorys", createInventory);
  // app.get("/inventorys", getInventorys);
  // app.get("/inventorys/:id", getInventoryById);
  // app.put("/inventorys/:id", updateInventory);
  // app.delete("/inventorys/:id", deleteInventory);

  app.post(
    "/inventorys",
    { schema: { body: inventorySchema } },
    createInventory
  );
  app.get("/inventorys", getInventorys);
  app.get(
    "/inventorys/:id",
    { schema: { params: idParamSchema } },
    getInventoryById
  );
  app.put(
    "/inventorys/:id",
    { schema: { params: idParamSchema, body: inventorySchema } },
    updateInventory
  );
  app.delete(
    "/inventorys/:id",
    { schema: { params: idParamSchema } },
    deleteInventory
  );
}

exports.routes = routes;
