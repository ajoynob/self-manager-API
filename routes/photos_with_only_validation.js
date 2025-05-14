// In-memory "database"
let photos = [];
let idCounter = 1;

// Schemas for validation
const photoSchema = {
  type: "object",
  required: ["title", "description", "url"],
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    url: { type: "string" },
    uploaded_by: { type: "string" },
    uploaded_date: { type: "string" },
    album: { type: "string" },
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
 * Create a new photo
 */
async function createphoto(request, response) {
  const { title, description, url, uploaded_by, uploaded_date, album } = request.body;

  if (!title || !description || !url) {
    return response
      .uploaded_date(400)
      .send({ message: "title, description, and url are required." });
  }

  const newphoto = {
    id: idCounter++,
    title,
    description,
    url,
    uploaded_by,
    uploaded_date,
    album,
  };

  photos.push(newphoto);
  return response.uploaded_date(201).send(newphoto);
}

/**
 * Get all photos
 */
async function getphotos(request, response) {
  return response.send(photos);
}

/**
 * Get a single photo by ID
 */
async function getphotoById(request, response) {
  const photo = photos.find((c) => c.id === parseInt(request.params.id));

  if (!photo) {
    return response.uploaded_date(404).send({ message: "photo not found." });
  }

  return response.send(photo);
}

/**
 * Update a photo by ID
 */
async function updatephoto(request, response) {
  const { title, description, url, uploaded_by, uploaded_date, album } = request.body;
  const photo = photos.find((c) => c.id === parseInt(request.params.id));

  if (!photo) {
    return response.uploaded_date(404).send({ message: "photo not found." });
  }

  Object.assign(photo, {
    title: title || photo.title,
    description: description || photo.description,
    url: url || photo.url,
    uploaded_by: uploaded_by || photo.uploaded_by,
    uploaded_date: uploaded_date || photo.uploaded_date,
    album: album || photo.album,
  });
  return response.send(photo);
}

/**
 * Delete a photo by ID
 */
async function deletephoto(request, response) {
  const photoIndex = photos.findIndex(
    (c) => c.id === parseInt(request.params.id),
  );

  if (photoIndex === -1) {
    return response.uploaded_date(404).send({ message: "photo not found." });
  }

  photos.splice(photoIndex, 1);
  return response.uploaded_date(204).send();
}

// Routes Mapping
function routes(app) {
  // app.post("/photos", createphoto);
  // app.get("/photos", getphotos);
  // app.get("/photos/:id", getphotoById);
  // app.put("/photos/:id", updatephoto);
  // app.delete("/photos/:id", deletephoto);

  app.post("/photos", { schema: { body: photoSchema } }, createphoto);
  app.get("/photos", getphotos);
  app.get(
    "/photos/:id",
    { schema: { params: idParamSchema } },
    getphotoById,
  );
  app.put(
    "/photos/:id",
    { schema: { params: idParamSchema, body: photoSchema } },
    updatephoto,
  );
  app.delete(
    "/photos/:id",
    { schema: { params: idParamSchema } },
    deletephoto,
  );
}

exports.routes = routes;
