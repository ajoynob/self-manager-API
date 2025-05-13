// In-memory "database"
let groceries = [];
let idCounter = 1;

// Handlers

/**
 * Create a new Groceries
 */
async function createGroceries(request, response) {
  const {
    item_name,
    quantity,
    price,
    purchased,
    purchase_date,
    category
  } = request.body;

  if (!item_name || !quantity || !price) {
    return response
      .status(400)
      .send({ message: "Item Name, Quantity and Price are required." });
  }

  const newGroceries = {
    id: idCounter++,
    item_name,
    quantity,
    price,
    purchased,
    purchase_date,
    category,
  };

  groceries.push(newGroceries);
  return response.status(201).send(newGroceries);
}

/**
 * Get all groceries
 */
async function getGroceries(request, response) {
  return response.send(groceries);
}

/**
 * Get a single Groceries by ID
 */
async function getGroceriesById(request, response) {
  const Groceries = groceries.find((c) => c.id === parseInt(request.params.id));

  if (!Groceries) {
    return response.status(404).send({ message: "Groceries not found." });
  }

  return response.send(Groceries);
}

/**
 * Update a Groceries by ID
 */
async function updateGroceries(request, response) {
  const {
    item_name,
    quantity,
    price,
    purchased,
    purchase_date,
    category
  } = request.body;
  const Groceries = groceries.find((c) => c.id === parseInt(request.params.id));

  if (!Groceries) {
    return response.status(404).send({ message: "Groceries not found." });
  }

  Object.assign(Groceries, {
    item_name: item_name || Groceries.item_name,
    quantity: quantity || Groceries.quantity,
    price: price || Groceries.price,
    purchased: purchased || Groceries.purchased,
    purchase_date: purchase_date || Groceries.purchase_date,
    category: category || Groceries.category,
  });
  return response.send(Groceries);
}

/**
 * Delete a Groceries by ID
 */
async function deleteGroceries(request, response) {
  const GroceriesIndex = groceries.findIndex(
    (c) => c.id === parseInt(request.params.id)
  );

  if (GroceriesIndex === -1) {
    return response.status(404).send({ message: "Groceries not found." });
  }

  groceries.splice(GroceriesIndex, 1);
  return response.status(204).send();
}

// Routes Mapping
function routes(app) {
  app.post("/groceries", createGroceries);
  app.get("/groceries", getGroceries);
  app.get("/groceries/:id", getGroceriesById);
  app.put("/groceries/:id", updateGroceries);
  app.delete("/groceries/:id", deleteGroceries);
}

exports.routes = routes;
