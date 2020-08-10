// load routes
const clientiRoutes = require("./clienti");
const ristoratoriRoutes = require("./ristoratori");

const appRouter = (app, fs) => {
  // Default route here that handles empty routes
  app.get("/", (req, res) => {
    res.send("Pagina Home");
  });

  clientiRoutes(app, fs);
  ristoratoriRoutes(app, fs);
};

module.exports = appRouter;