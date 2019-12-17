const Match = require("../models").Match;
const Event = require("../models").Event;
const User = require("../models").User;

let matchAttributes = ['id', 'userId', 'codeId'];
let userAttributes = ['userId', 'email'];
let eventAttributes = ['codeId', 'name', 'webUrl', 'eventDate'];

module.exports = {
  /// ----------------
  /// ---- CREATE ----
  /// ----------------
  //Create Match by userId and codeId
  create(req, res) {
    if (isNaN(req.body.userId) || isNaN(req.body.codeId)) {
      /// Body Is Invalid
      return res.status(400).send({ success: false, message: "Error. userId and codeId must be a number" })
    }
    /// Body Valid -> Try To Find User
    return User.findOne({
      where: { userId: req.body.userId }, 
      attributes: userAttributes
    })
    .then(user => {
      if (!user) {
        /// User Not Found
        return res.status(404).send({ success: false, message: "Error. User Not Found" });
      }
      /// User Found -> Try to Find Event
      return Event.findOne({
        where: { codeId: req.body.codeId }, 
        attributes: eventAttributes 
      })
      .then(event => {
        if (!event) {
          /// Event Not Found
          return res.status(404).send({ success: false, message: "Error. Event Not Found" });
        }
        /// Event Found -> Try To Create Match
        return Match.findOrCreate({ 
          where: req.body, 
          attributes: matchAttributes
        })
        .then(match => {
          /// Match Created
          let isCreated = match[1];
          let statusMessage = isCreated ? 'Successfully created a match entity. Event Attached' : 'Successfully found the match entity. Event was Attached';
          let status = (isCreated ? 201 : 200);
          res.status(status).send({ success: true, message: statusMessage, data: event });
        })
        /// Create Match Error
        .catch(error => res.status(400).send({ success: false, message: "Error. Can't Create match", data: error }));
      })
      /// Fetch Event Error
      .catch(error => res.status(400).send({ success: false, message: "Error. Can't get event", data: error }));
    })
    /// Fetch User Error
    .catch(error => res.status(400).send({ success: false, message: "Error. Can't Get User", data: error }));
  },
  /// ----------------
  /// ----- GET ------
  /// ----------------
  // Get All Matches
  list(req, res) {
    return Match.findAll({ 
      attributes: matchAttributes 
    })
    .then(matches => res.status(200).send({ success: true, message: "Fetched Successfully", data: matches }))
    .catch(error => res.status(400).send({ success: false, message: "Error. Can't Get Matches", data: error }));
  },
  // Get match by userId
  listForUser(req, res) {
    if (isNaN(req.params.userId)) {
      return res.status(400).send({ success: false, message: "Error. userId must be a number" })
    }
    return Match.findAll({ 
      where: { userId: req.params.userId }, 
      attributes: matchAttributes
    })
    .then(match => {
      if (!match) {
        return res.status(404).send({ success: false, message: "Error. Match Not Found" })
      }
      return res.status(200).send({ success: true, message: "Fetched Successfully", data: match });
    })
    .catch(error => res.status(400).send({ success: false, message: "Error. Can't Get Matches", data: error }));
  },
  // Get match by codeId
  listForEvent(req, res) {
    if (isNaN(req.params.codeId)) {
      return res.status(400).send({ success: false, message: "Error. codeId must be a number" })
    }
    return Match.findAll({
      where: { codeId: req.params.codeId }, 
      attributes: matchAttributes
    })
    .then(match => {
      if (!match) {
        return res.status(404).send({ success: false, message: "Error. Match Not Found" })
      }
      return res.status(200).send({ success: true, message: "Fetched Successfully", data: match });
    })
    .catch(error => res.status(400).send({ success: false, message: "Error. Can't Get Matches", data: error }));
  },
  // Get Match by id
  retrieve(req, res) {
    if (isNaN(req.params.matchId)) {
      return res.status(400).send({ success: false, message: "Error. matchId must be a number" })
    }
    return Match.findOne({
      where: { id: req.params.matchId }, 
      attributes: matchAttributes
    })
    .then(match => {
      if (!match) {
        return res.status(404).send({ success: false, message: "Error. Match Not Found" })
      }
      return res.status(200).send({ success: true, message: "Fetched Successfully", data: match });
    })
    .catch(error => res.status(400).send({ success: false, message: "Error. Can't Get Match", data: error }));
  },
  /// ----------------
  /// ---- UPDATE ----
  /// ----------------
  // Update Match by matchId
  update(req, res) {
    if (isNaN(req.params.matchId)) {
      return res.status(400).send({ success: false, message: "Error. matchId must be a number" });
    }
    req.body
    if (isNaN(req.body.userId) || isNaN(req.body.codeId)) {
      return res.status(400).send({ success: false, message: "Error. userId, codeId must exist" });
    }
    return Match.findOne({ 
      where: { id: req.params.matchId }
    })
    .then(match => {
        if (!match) {
          return res.status(404).send({ success: false, message: "Error. Match Not Found" })
        }
        return match
        .update(req.body)
        .then((result) => res.status(200).send({ success: true, message: "Updated Successfully", data: result }))
        .catch(error => res.status(400).send({ success: false, message: "Error. Can't Update Match", data: error })); 
      })
      .catch(error => res.status(400).send({ success: false, message: "Error. Can't find Match for update", data: error }));
  },
  /// ----------------
  /// ---- DELETE ----
  /// ----------------
  // Delete Match by id
  delete(req, res) {
    if (isNaN(req.params.matchId)) {
      return res.status(400).send({ success: false, message: "Error. matchId must be a number" })
    }
    return Match.findOne({
      where: { id: req.params.matchId }
    })
    .then(match => {
      if (!match) {
        return res.status(404).send({ success: false, message: "Error. Match Not Found" })
      }
      return match
      .destroy({ returning: true, checkExistance: true })
      .then((result) => res.status(204).send({ success: true, message: "Successfully deleted the match", data: result }))
      .catch(error => res.status(400).send({ success: false, message: "Error. Can't Delete Match", data: error }));
    })
    .catch(error => res.status(400).send({ success: false, message: "Error. Can't find Match for delete", data: error }));
  }
};
