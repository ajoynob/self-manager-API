// In-memory "database"
let cloths = [];
let idCounter = 1;

// Handlers

/**
 * Create a new Cloth
 */
async function createCloth(request, response) {
  const {
    item_name,
    size,
    color,
    material,
    purchase_date,
    price,
    catagory,
    notes
  } = request.body;

  if (!item_name || !size || !color) {
    return response
      .status(400)
      .send({ message: "Item Name, Size, and Color are required." });
  }

  const newCloth = {
    id: idCounter++,
    item_name,
    size,
    color,
    material,
    purchase_date,
    price,
    catagory,
    notes,
  };

  cloths.push(newCloth);
  return response.status(201).send(newCloth);
}

/**
 * Get all cloths
 */
async function getCloths(request, response) {
  return response.send(cloths);
}

/**
 * Get a single Cloth by ID
 */
async function getClothById(request, response) {
  const Cloth = cloths.find((c) => c.id === parseInt(request.params.id));

  if (!Cloth) {
    return response.status(404).send({ message: "Cloth not found." });
  }

  return response.send(Cloth);
}

/**
 * Update a Cloth by ID
 */
async function updateCloth(request, response) {
  const {
    item_name,
    size,
    color,
    material,
    purchase_date,
    price,
    catagory,
    notes
  } = request.body;
  const Cloth = cloths.find((c) => c.id === parseInt(request.params.id));

  if (!Cloth) {
    return response.status(404).send({ message: "Cloth not found." });
  }

  Object.assign(Cloth, {
    item_name: item_name || Cloth.item_name,
    size: size || Cloth.size,
    color: color || Cloth.color,
    material: material || Cloth.material,
    purchase_date: purchase_date || Cloth.purchase_date,
    price: price || Cloth.price,
    catagory: catagory || Cloth.catagory,
    notes: notes || Cloth.notes,
  });
  return response.send(Cloth);
}

/**
 * Delete a Cloth by ID
 */
async function deleteCloth(request, response) {
  const ClothIndex = cloths.findIndex(
    (c) => c.id === parseInt(request.params.id)
  );

  if (ClothIndex === -1) {
    return response.status(404).send({ message: "Cloth not found." });
  }

  cloths.splice(ClothIndex, 1);
  return response.status(204).send();
}

// Routes Mapping
function routes(app) {
  app.post("/cloths", createCloth);
  app.get("/cloths", getCloths);
  app.get("/cloths/:id", getClothById);
  app.put("/cloths/:id", updateCloth);
  app.delete("/cloths/:id", deleteCloth);
}

exports.routes = routes;
