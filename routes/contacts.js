const Loki = require("lokijs");

const db = new Loki("sm.db", {
  autoload: true,
  autoloadCallback: loadDatabase,
  autosave: true,
  autosaveInterval: 4000,
});


function loadDatabase() {
  console.log("Database loaded");
}

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

const contactsDb =  db.addCollection("contacts");

// Handlers
async function createContact(request, reply) {
  const newContact = await contactsDb.insert(request.body);
  db.saveDatabase();
  return reply.status(201).send(newContact);
}

async function getContacts(request, reply) {
  const contacts = await contactsDb.find();
  return reply.send(contacts);
}

async function getContactById(request, reply) {
  const contact = await contactsDb.findOne({ $loki: parseInt(id) });
  if (!contact) {
    return reply.status(404).send({ message: "Contact not found." });
  }
  return reply.send(contact);
}

async function updateContact(request, reply) {

  const doc = contactsDb.findOne({ $loki: parseInt(request.params.id) });
    if (doc) {
      Object.assign(doc, request.body);
      contactsDb.update(doc);
      db.saveDatabase();
    }
  if (!doc) {
    return reply.status(404).send({ message: "Contact not found." });
  }
  return reply.send(doc);
}

async function deleteContact(request, reply) {
  // const numRemoved = await contactsDb.delete(request.params.id);
  const doc = await contactsDb.findOne({ $loki: parseInt(request.params.id) });
    if (doc) {
      Object.assign(doc, request.body);
      contactsDb.remove(doc);
      db.saveDatabase();
    }
  if (!doc) {
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
