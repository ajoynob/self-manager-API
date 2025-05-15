//Import the Fastify framework and others library
const Fastify = require("fastify");
const contacts = require("./routes/contacts");
const users = require("./routes/users");
const call_schedule = require("./routes/call_schedule");
const books = require("./routes/books");
const meeting = require("./routes/meeting");
const cloths = require("./routes/cloths");
const groceries = require("./routes/groceries");
const inventor = require("./routes/inventor");
const medicine = require("./routes/medicine");
const researches = require("./routes/researches");
const photos = require("./routes/photos");
const todo = require("./routes/todo");

// Initialize Fastify
const app = Fastify({ logger: true });

// Register the contacts routes
contacts.routes(app);
users.routes(app); 
call_schedule.routes(app);
books.routes(app);
meeting.routes(app);
cloths.routes(app);
groceries.routes(app);
inventor.routes(app);
medicine.routes(app);
researches.routes(app);
photos.routes(app);
todo.routes(app);

// Start the server
const start = async () => {
  try {
    await app.listen({ port: 3000 });
    console.log("Server running at http://localhost:3000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
