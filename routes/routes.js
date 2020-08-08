// load routes
const userRoutes = require("./users");
const ristoratoriRoutes = require("./ristoratori");

const appRouter = (app, fs) => {
  // Default route here that handles empty routes
  app.get("/", (req, res) => {
    res.send("Pagina Home");
  });

  userRoutes(app, fs);
  ristoratoriRoutes(app, fs);
};

module.exports = appRouter;