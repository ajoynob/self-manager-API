const Loki = require("lokijs");

const db = new Loki("sm.db", {
  autoload: true,
  autoloadCallback: loadDatabase,
  autosave: true,
  autosaveInterval: 4000,
});

const collections = {}; // Store collections globally

function loadDatabase() {
  console.log("Database loaded");
}

function getCollection(name) {
  if (!collections[name]) {
    let collection = db.getCollection(name);
    if (!collection) {
      collection = db.addCollection(name, { autoupdate: true });
    }
    collections[name] = collection;
  }
  return collections[name];
}

function dbHelper(collectionName) {
  return {
    insert: (data) => {
      const collection = getCollection(collectionName);
      const doc = collection.insert(data);
      db.saveDatabase();
      return doc;
    },
    findAll: () => {
      const collection = getCollection(collectionName);
      return collection.find();
    },
    findById: (id) => {
      const collection = getCollection(collectionName);
      return collection.findOne({ $loki: parseInt(id) });
    },
    update: (id, updates) => {
      const collection = getCollection(collectionName);
      const doc = collection.findOne({ $loki: parseInt(id) });
      if (doc) {
        Object.assign(doc, updates);
        collection.update(doc);
        db.saveDatabase();
      }
      return doc;
    },
    delete: (id) => {
      const collection = getCollection(collectionName);
      const doc = collection.findOne({ $loki: parseInt(id) });
      if (doc) {
        collection.remove(doc);
        db.saveDatabase();
        return true;
      }
      return false;
    },
  };
}

module.exports = dbHelper;
