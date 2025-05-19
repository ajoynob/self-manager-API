const dbHelper = require("../dbHelper");

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
    location: { type: "string" },
  },
};

const idParamSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
};

const inventorysDb = dbHelper("inventorys");

// Handlers
async function createInventory(request, reply) {
  const newInventory = await inventorysDb.insert(request.body);
  return reply.status(201).send(newInventory);
}

async function getInventorys(request, reply) {
  const inventorys = await inventorysDb.findAll();
  return reply.send(inventorys);
}

async function getInventoryById(request, reply) {
  const inventory = await inventorysDb.findById(request.params.id);
  if (!inventory) {
    return reply.status(404).send({ message: "Inventory not found." });
  }
  return reply.send(inventory);
}

async function updateInventory(request, reply) {
  const updatedInventory = await inventorysDb.update(
    request.params.id,
    request.body
  );
  if (!updatedInventory) {
    return reply.status(404).send({ message: "Inventory not found." });
  }
  return reply.send(updatedInventory);
}

async function deleteInventory(request, reply) {
  const numRemoved = await inventorysDb.delete(request.params.id);
  if (numRemoved === 0) {
    return reply.status(404).send({ message: "Inventory not found." });
  }
  return reply.status(204).send();
}

// Routes Mapping with validation schemas
function routes(app) {
  app.post(
    "/inventorys",
    { schema: { body: inventorySchema} },
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
