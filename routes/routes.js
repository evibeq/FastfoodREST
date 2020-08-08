// load routes
const userRoutes = require("./users");
const ristoratoriRoutes = require("./ristoratori");

const appRouter = (app, fs) => {
  // Default route here that handles empty routes
  app.get("/", (req, res) => {
    res.send("welcome to the development api-server");
  });

  userRoutes(app, fs);
  ristoratoriRoutes(app, fs);
};

module.exports = appRouter;