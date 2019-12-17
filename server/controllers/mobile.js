const User = require("../models").User;
const Match = require("../models").Match;
const Event = require("../models").Event;
const userController = require("./user");
const matchController = require("./match");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

let userAttributes = ['userId', 'email'];
let matchAttributes = ['id', 'userId', 'codeId'];
let eventAttributes = ['codeId', 'name', 'webUrl', 'eventDate'];

module.exports = {
  /// ----------------
  /// ---- CREATE ----
  /// ----------------
  //Create User by Email (or fetch if exists)
  createUser(req, res) {
    return userController.create(req, res);
  },
  createMatch(req, res) {
    return matchController.create(req, res);
  },
  /// ----------------
  /// ----- GET ------
  /// ----------------
  // Get All Users
  listOfEventsForUser(req, res) {
    if (isNaN(req.params.userId)) {
      /// Parameters Is Invalid
      return res.status(400).send({ success: false, message: "Error. userId must be a number" })
    }
    /// Body Valid -> Try To Find User
    return User.findOne({
      where: { userId: req.params.userId }, 
      attributes: userAttributes
    })
    .then(user => {
      if (!user) {
        /// User Not Found
        return res.status(404).send({ success: false, message: "Error. User Not Found" });
      }
      /// User Found -> Try to Get All Matches
      return Match.findAll({ 
        where: { userId: req.params.userId }, 
        attributes: matchAttributes
      })
      .then(match => {
        if (!match) {
          /// Matches Not Found
          return res.status(404).send({ success: false, message: "Error. Match Not Found" });
        }
        /// Matches Found -> Try Get Events
        let eventsCodeIds = match.map(matchElement => matchElement.codeId);
        return Event.findAll({ 
          where: { codeId: { [Op.or]: eventsCodeIds }}, 
          attributes: eventAttributes 
        })
        /// Events Found
        .then(events => res.status(200).send({ success: true, message: "Fetched Successfully", data: events }))
        /// Fetch Events Error
        .catch(error => res.status(400).send({ success: false, message: "Error. Can't get Events", data: error }));
      })
      /// Fetch Matches Error
      .catch(error => res.status(400).send({ success: false, message: "Error. Can't Get Matches", data: error }));
    })
    /// Fetch User Error
    .catch(error => res.status(400).send({ success: false, message: "Error. Can't get user", data: error }));
  },
  /// ----------------
  /// ---- DELETE ----
  /// ----------------
  // Delete Users Event Pair
  deleteUserMatchPair(req, res) {
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
      /// User Found -> Try to Get All Matches
      return Match.findOne({ 
        where: { userId: req.body.userId, codeId: req.body.codeId },
        attributes: matchAttributes
      })
      .then(match => {
        if (!match) {
          /// User Not Found
          return res.status(404).send({ success: false, message: "Error. Match Not Found" });
        }
        /// Match Found -> Try to Delete Matches
        return Match.destroy({ 
          where: { userId: req.body.userId, codeId: req.body.codeId }
        })
        .then((result) => res.status(204).send({ success: true, message: "Successfully deleted the matches", data: result }))
        /// Delete Matches Error
        .catch(error => res.status(400).send({ success: false, message: "Error. Can't Get Matches", data: error }));
      })
      /// Fetch Match Error
      .catch(error => res.status(400).send({ success: false, message: "Error. Can't Get Matches", data: error }));
    })
    /// Fetch User Error
    .catch(error => res.status(400).send({ success: false, message: "Error. Can't get user", data: error }));
  },
};
