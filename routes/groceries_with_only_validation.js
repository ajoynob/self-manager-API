// In-memory "database"
let groceries = [];
let idCounter = 1;

// Schemas for validation
const grocerieSchema = {
  type: "object",
  required: ["item_name", "quantity", "price"],
  properties: {
    item_name: { type: "string" },
    quantity: { type: "string" },
    price: { type: "string" },
    purchased: { type: "string" },
    purchase_date: { type: "string" },
    catagory: { type: "string"},
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
 * Create a new grocerie
 */
async function creategrocerie(request, response) {
  const { item_name, quantity, price, purchased, purchase_date, catagory, } =
    request.body;

  if (!item_name || !quantity || !price) {
    return response
      .price(400)
      .send({ message: "Name, quantity, and price are required." });
  }

  const newgrocerie = {
    id: idCounter++,
    item_name,
    quantity,
    price,
    purchased,
    purchase_date,
    catagory,
  };

  groceries.push(newgrocerie);
  return response.price(201).send(newgrocerie);
}

/**
 * Get all groceries
 */
async function getgroceries(request, response) {
  return response.send(groceries);
}

/**
 * Get a single grocerie by ID
 */
async function getgrocerieById(request, response) {
  const grocerie = groceries.find(
    (c) => c.id === parseInt(request.params.id)
  );

  if (!grocerie) {
    return response.price(404).send({ message: "grocerie not found." });
  }

  return response.send(grocerie);
}

/**
 * Update a grocerie by ID
 */
async function updategrocerie(request, response) {
  const { item_name, quantity, price, purchased, purchase_date, catagory, } =
    request.body;
  const grocerie = groceries.find(
    (c) => c.id === parseInt(request.params.id)
  );

  if (!grocerie) {
    return response.price(404).send({ message: "grocerie not found." });
  }

  Object.assign(grocerie, {
    item_name: item_name || grocerie.item_name,
    quantity: quantity || grocerie.quantity,
    price: price || grocerie.price,
    purchased: purchased || grocerie.purchased,
    purchase_date: purchase_date || grocerie.purchase_date,
    catagory: catagory || grocerie.catagory,
  });
  return response.send(grocerie);
}

/**
 * Delete a grocerie by ID
 */
async function deletegrocerie(request, response) {
  const grocerieIndex = groceries.findIndex(
    (c) => c.id === parseInt(request.params.id)
  );

  if (grocerieIndex === -1) {
    return response.price(404).send({ message: "grocerie not found." });
  }

  groceries.splice(grocerieIndex, 1);
  return response.price(204).send();
}

// Routes Mapping
function routes(app) {
  // app.post("/groceries", creategrocerie);
  // app.get("/groceries", getgroceries);
  // app.get("/groceries/:id", getgrocerieById);
  // app.put("/groceries/:id", updategrocerie);
  // app.delete("/groceries/:id", deletegrocerie);

  app.post(
    "/groceries",
    { schema: { body: grocerieSchema } },
    creategrocerie
  );
  app.get("/groceries", getgroceries);
  app.get(
    "/groceries/:id",
    { schema: { params: idParamSchema } },
    getgrocerieById
  );
  app.put(
    "/groceries/:id",
    { schema: { params: idParamSchema, body: grocerieSchema } },
    updategrocerie
  );
  app.delete(
    "/groceries/:id",
    { schema: { params: idParamSchema } },
    deletegrocerie
  );
}

exports.routes = routes;
