// In-memory "database"
let photos = [];
let idCounter = 1;

// Handlers

/**
 * Create a new Photo
 */
async function createPhoto(request, response) {
  const { title, description, url, uploaded_by, uploaded_date, album } = request.body;

  if (!title || !description || !url) {
    return response
      .status(400)
      .send({ message: "Title, Description, and URL are required." });
  }

  const newPhoto = {
    id: idCounter++,
    title,
    description,
    url,
    uploaded_by,
    uploaded_date,
    album,
  };

  photos.push(newPhoto);
  return response.status(201).send(newPhoto);
}

/**
 * Get all photos
 */
async function getPhotos(request, response) {
  return response.send(photos);
}

/**
 * Get a single Photo by ID
 */
async function getPhotoById(request, response) {
  const Photo = photos.find((c) => c.id === parseInt(request.params.id));

  if (!Photo) {
    return response.status(404).send({ message: "Photo not found." });
  }

  return response.send(Photo);
}

/**
 * Update a Photo by ID
 */
async function updatePhoto(request, response) {
  const { title, description, url, uploaded_by, uploaded_date, album } = request.body;
  const Photo = photos.find((c) => c.id === parseInt(request.params.id));

  if (!Photo) {
    return response.status(404).send({ message: "Photo not found." });
  }

  Object.assign(Photo, {
    title: title || Photo.title,
    description: description || Photo.description,
    url: url || Photo.url,
    uploaded_by: uploaded_by || Photo.uploaded_by,
    uploaded_date: uploaded_date || Photo.uploaded_date,
    album: album || Photo.album,
  });
  return response.send(Photo);
}

/**
 * Delete a Photo by ID
 */
async function deletePhoto(request, response) {
  const PhotoIndex = photos.findIndex(
    (c) => c.id === parseInt(request.params.id)
  );

  if (PhotoIndex === -1) {
    return response.status(404).send({ message: "Photo not found." });
  }

  photos.splice(PhotoIndex, 1);
  return response.status(204).send();
}

// Routes Mapping
function routes(app) {
  app.post("/photos", createPhoto);
  app.get("/photos", getPhotos);
  app.get("/photos/:id", getPhotoById);
  app.put("/photos/:id", updatePhoto);
  app.delete("/photos/:id", deletePhoto);
}

exports.routes = routes;
