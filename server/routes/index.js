const userController = require("../controllers").user;
const matchController = require("../controllers").match;
const eventController = require("../controllers").event;
const mobileController = require("../controllers").mobile;

module.exports = app => {
  app.get("/api", (req, res) =>
    res.status(200).send({
      message: "Welcome to the API!"
    })
  );

  ///---USER--- Methods
  // POST user
  app.post("/api/user", userController.create);

  // GET list of all items
  app.get("/api/user", userController.list);
  // GET a single user by ID
  app.get("/api/user/:userId", userController.retrieve);

  // UPDATE a single user by ID
  app.put("/api/user/:userId", userController.update);

  // DELETE a single user by ID
  app.delete("/api/user/:userId", userController.delete);

  ///---MATCH--- Methods
  // POST match
  app.post("/api/match", matchController.create);

  // GET list of all matches
  app.get("/api/match", matchController.list);
  // GET list of all matches for user
  app.get("/api/match/user/:userId", matchController.listForUser);
  // GET list of all matches for event
  app.get("/api/match/event/:codeId", matchController.listForEvent);
  // GET a single match by ID
  app.get("/api/match/:matchId", matchController.retrieve);

  // UPDATE a single match by ID
  app.put("/api/match/:matchId", matchController.update);

  // DELETE a single user by ID
  app.delete("/api/match/:matchId", matchController.delete);

  ///---EVENTS--- Methods
  // POST event
  app.post("/api/event", eventController.create);
  // POST event List
  app.post("/api/eventList", eventController.createFromList);

  // GET list of all events
  app.get("/api/event", eventController.list);
  // POST->GET list of all events
  app.post("/api/eventsByIds", eventController.listByIds);
  // GET event by codeId
  app.get("/api/event/:codeId", eventController.retrieve);

  // UPDATE single event by codeId
  app.put("/api/event/:codeId", eventController.update);


  // DELETE a single event by ID
  app.delete("/api/event/:codeId", eventController.delete);

  // DELETE a list of events by IDs
  app.delete("/api/eventList", eventController.deleteList);

  ///---MOBILE--- Methods
  // POST Create User
  app.post("/api/mobile/createUser", mobileController.createUser);
  // POST Create Match
  app.post("/api/mobile/createMatch", mobileController.createMatch);

  // GET All Events For UserId
  app.get("/api/mobile/eventsForUser/:userId", mobileController.listOfEventsForUser);

  // DELETE All Matches For userId and codeId
  app.post("/api/mobile/deleteMatch", mobileController.deleteUserMatchPair);

};