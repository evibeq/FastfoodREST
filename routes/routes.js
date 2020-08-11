// load routes
const clientiRoutes = require("./clienti");
const ristoratoriRoutes = require("./ristoratori");
const parametriRoutes = require("./parametri");
const prodottiRoutes = require("./prodotti");
const recensioniRoutes = require("./recensioni");

const appRouter = (app, fs) => {
  // Default route here that handles empty routes
  app.get("/", (req, res) => {
    res.send("Pagina Home");
  });

  clientiRoutes(app, fs);
  ristoratoriRoutes(app, fs);
  parametriRoutes(app, fs);
  prodottiRoutes(app, fs);
  recensioniRoutes(app, fs);

};

module.exports = appRouter;