// In-memory "database"
let contacts = [];
let idCounter = 1;

// Handlers

/**
 * Create a new contact
 */
async function createContact(request, response) {
  const { name, phone, email, relation, address, notes } = request.body;

  if (!name || !phone || !email) {
    return response
      .status(400)
      .send({ message: "Name, phone, and email are required." });
  }

  const newContact = {
    id: idCounter++,
    name,
    phone,
    email,
    relation,
    address,
    notes,
  };

  contacts.push(newContact);
  return response.status(201).send(newContact);
}

/**
 * Get all contacts
 */
async function getContacts(request, response) {
  return response.send(contacts);
}

/**
 * Get a single contact by ID
 */
async function getContactById(request, response) {
  const contact = contacts.find((c) => c.id === parseInt(request.params.id));

  if (!contact) {
    return response.status(404).send({ message: "Contact not found." });
  }

  return response.send(contact);
}

/**
 * Update a contact by ID
 */
async function updateContact(request, response) {
  const { name, phone, email, relation, address, notes } = request.body;
  const contact = contacts.find((c) => c.id === parseInt(request.params.id));

  if (!contact) {
    return response.status(404).send({ message: "Contact not found." });
  }

  Object.assign(contact, {
    name: name || contact.name,
    phone: phone || contact.phone,
    email: email || contact.email,
    relation: relation || contact.relation,
    address: address || contact.address,
    notes: notes || contact.notes,
  });
  return response.send(contact);
}

/**
 * Delete a contact by ID
 */
async function deleteContact(request, response) {
  const contactIndex = contacts.findIndex(
    (c) => c.id === parseInt(request.params.id)
  );

  if (contactIndex === -1) {
    return response.status(404).send({ message: "Contact not found." });
  }

  contacts.splice(contactIndex, 1);
  return response.status(204).send();
}

// Routes Mapping
function routes(app) {
  app.post("/contacts", createContact);
  app.get("/contacts", getContacts);
  app.get("/contacts/:id", getContactById);
  app.put("/contacts/:id", updateContact);
  app.delete("/contacts/:id", deleteContact);
}

exports.routes = routes;
