const Event = require("../models").Event;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

let eventAttributes = ['codeId', 'name', 'webUrl', 'eventDate'];

module.exports = {
  /// ----------------
  /// ---- CREATE ----
  /// ----------------
  //Create Event by name, web url, event date
  create(req, res) {
    if (!req.body.name || !req.body.webUrl, !req.body.eventDate) {
      return res.status(400).send({ success: false, message: "Error. name, webUrl and eventDate must exist" })
    }
    return Event.findOrCreate({ 
      where: req.body, 
      attributes: eventAttributes
    })
    .then(event => {
      let isCreated = event[1];
      let statusMessage = isCreated ? 'Successfully created an event entity.' : 'Successfully found the event entity.';
      let status = (isCreated ? 201 : 200);
      res.status(status).send({ success: true, message: statusMessage, data: event[0], isCreate: isCreated })
    })
    .catch(error => res.status(400).send({ success: false, message: "Error. Can't Create event", data: error }));
  },
  //Create Event List by name, web url, date
  createFromList(req, res) {
    if (Array.isArray(req.body) == false) {
      return res.status(400).send({ success: false, message: "Error. Body must be an array" })
    }
    return Event.bulkCreate(req.body, { validate: true, returning: true })
    .then(() => {
      Event.findAll({ 
        where: { [Op.or]: req.body }, 
        attributes: eventAttributes
      })
      .then((events) => res.status(200).send({ success: true, message: "Created Successfully", data: events }))
      .catch(error => res.status(400).send({ success: false, message: "Error. Can't fetch events", data: error}));
    }) 
    .catch(error => res.status(400).send({ success: false, message: "Error. Can't save events", data: error })
    );    
  },
  /// ----------------
  /// ----- GET ------
  /// ----------------
  // Get All Events
  list(req, res) {
    return Event.findAll({ 
      attributes: eventAttributes 
    })
    .then(events => res.status(200).send({ success: true, message: "Fetched Successfully", data: events }))
    .catch(error => res.status(400).send({ success: false, message: "Error. Can't get events", data: error }));
  },
  // Get Events by codeIds
  listByIds(req, res) {
    if (Array.isArray(req.body.codeIds) == false) {
      return res.status(400).send({ success: false, message: "Error. Must contain 'codeIds' array" })
    }
    return Event.findAll({ 
      where: { codeId: { [Op.or]: req.body.codeIds }}, 
      attributes: eventAttributes 
    })
    .then(events => res.status(200).send({ success: true, message: "Fetched Successfully", data: events }))
    .catch(error => res.status(400).send({ success: false, message: "Error. Can't get events", data: error }));
  },
  // Get Event by codeId
  retrieve(req, res) {
    if (isNaN(req.params.codeId)) {
      return res.status(400).send({ success: false, message: "Error. codeId must be a number" });
    }
    return Event.findOne({
      where: { codeId: req.params.codeId }, 
      attributes: eventAttributes 
    })
    .then(event => {
      if (!event) {
        return res.status(404).send({ success: false, message: "Error. Event Not Found" });
      } else {
        return res.status(200).send({ success: true, message: "Fetched Successfully", data: event });
      }
    })
    .catch(error => res.status(400).send({ success: false, message: "Error. Can't get event", data: error }));  
  },
  /// ----------------
  /// ---- UPDATE ----
  /// ----------------
  // Update Event by codeId
  update(req, res) {
    if (isNaN(req.params.codeId)) {
      return res.status(400).send({ success: false, message: "Error. codeId must be a number" })
    }
    return Event.findOne({
      where: { codeId: req.params.codeId }
    })
    .then(event => {
      if (!event) {
        return res.status(404).send({ success: false, message: "Error. Event Not Found" });
      } else {
        return event
        .update(req.body)
        .then((event) => res.status(200).send({ success: true, message: "Updated Successfully", data: event }))
        .catch(error => res.status(400).send({ success: false, message: "Error. Can't Update Event", data: error })); 
      }
    })
    .catch(error => res.status(400).send({ success: false, message: "Error. Can't find Event to delete", data: error }));
  },
  /// ----------------
  /// ---- DELETE ----
  /// ----------------
  // Delete Event by id
  delete(req, res) {
    if (isNaN(req.params.codeId)) {
      return res.status(400).send({ success: false, message: "Error. codeId must be a number" })
    }
    return Event.findOne({ 
      where: { id: req.params.codeId }
    })
    .then(event => {
      if (!event) {
        return res.status(404).send({ success: false, message: "Error. Event Not Found" });
      }
      return event
        .destroy({ returning: true, checkExistance: true })
        .then((result) => res.status(204).send({ success: true, message: "Successfully deleted the event", data: result }))
        .catch(error => res.status(400).send({ success: false, message: "Error. Can't delete event", data: error }));
    })
    .catch(error => res.status(400).send({ success: false, message: "Error. Can't find Event to delete", data: error }));
  },

  // Delete Event List by codeId
  deleteList(req, res) {
    if (Array.isArray(req.body.codeIds) == false) {
      return res.status(400).send({ success: false, message: "Error. Must contain 'codeIds' array" })
    }
    return Event.destroy({ 
      where: { codeId: { [Op.or]: req.body.codeIds } }
    })
    .then((result) => res.status(204).send({ success: true, message: "Successfully deleted the events", data: result }))
    .catch(error => res.status(400).send({ success: false, message: "Error. Can't delete events", data: error }));
  }
};
