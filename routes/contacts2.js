const dbHelper = require("../dbHelper");

// Schemas for validation
const contactSchema = {
  type: "object",
  required: ["name", "phone", "email"],
  properties: {
    name: { type: "string" },
    phone: { type: "string" },
    email: { type: "string", format: "email" },
    relation: { type: "string" },
    address: { type: "string" },
    notes: { type: "string" },
  },
};

const idParamSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
};

const contactsDb = dbHelper("contacts");

// Handlers
async function createContact(request, reply) {
  const newContact = await contactsDb.insert(request.body);
  return reply.status(201).send(newContact);
}

async function getContacts(request, reply) {
  const contacts = await contactsDb.findAll();
  return reply.send(contacts);
}

async function getContactById(request, reply) {
  const contact = await contactsDb.findById(request.params.id);
  if (!contact) {
    return reply.status(404).send({ message: "Contact not found." });
  }
  return reply.send(contact);
}

async function updateContact(request, reply) {
  const updatedContact = await contactsDb.update(
    request.params.id,
    request.body,
  );
  if (!updatedContact) {
    return reply.status(404).send({ message: "Contact not found." });
  }
  return reply.send(updatedContact);
}

async function deleteContact(request, reply) {
  const numRemoved = await contactsDb.delete(request.params.id);
  if (numRemoved === 0) {
    return reply.status(404).send({ message: "Contact not found." });
  }
  return reply.status(204).send();
}

// Routes Mapping with validation schemas
function routes(app) {
  app.post("/contacts", { schema: { body: contactSchema } }, createContact);
  app.get("/contacts", getContacts);
  app.get(
    "/contacts/:id",
    { schema: { params: idParamSchema } },
    getContactById,
  );
  app.put(
    "/contacts/:id",
    { schema: { params: idParamSchema, body: contactSchema } },
    updateContact,
  );
  app.delete(
    "/contacts/:id",
    { schema: { params: idParamSchema } },
    deleteContact,
  );
}

exports.routes = routes;
