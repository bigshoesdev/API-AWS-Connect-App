const User = require("../models").User;

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

let userAttributes = ['userId', 'email'];

module.exports = {
  /// ----------------
  /// ---- CREATE ----
  /// ----------------
  //Create User by Email (or fetch if exists)
  create(req, res) {
    if (validateEmail(req.body.email) == false) {
      return res.status(400).send({ success: false, message: "Email address is not valid" });
    }
    return User.findOrCreate({ 
      where: req.body
    })
    .then(user => {
      let isCreate = user[1];
      let statusMessage = isCreate ? 'Successfully created an user entity.' : 'Successfully finded the user entity.';
      let status = (isCreate ? 201 : 200);
      res.status(status).send({ success: true, message: statusMessage, data: user[0], isCreate: user[1] })
    })
    .catch(error => res.status(400).send({ success: false, message: "Error. Can't Create User", data: error }));
  },
  /// ----------------
  /// ----- GET ------
  /// ----------------
  // Get All Users
  list(req, res) {
    return User.findAll({ 
      attributes: userAttributes
    })
    .then(users => res.status(200).send({ success: true, message: "Fetched Successfully", data: users }))
    .catch(error => res.status(400).send({ success: false, message: "Error. Can't get users", data: error }));
  },
  // Get user by userId
  retrieve(req, res) {
    if (isNaN(req.params.userId)) {
      return res.status(400).send({ success: false, message: "Error. userId must be a number" });
    }
    return User.findOne({
      where: { userId: req.params.userId }, 
      attributes: userAttributes
    })
    .then(user => {
      if (!user) {
        return res.status(404).send({ success: false, message: "Error. User Not Found" });
      }
      return res.status(200).send({ success: true, message: "Fetched Successfully", data: user });
    })
    .catch(error => res.status(400).send({ success: false, message: "Error. Can't Get User", data: error }));
  },
  /// ----------------
  /// ---- UPDATE ----
  /// ----------------
  // Update User by userId
  update(req, res) {
    if (isNaN(req.params.userId)) {
      return res.status(400).send({ success: false, message: "Error. userId must be a number" })
    }
    return User.findOne({
      where: { userId: req.params.userId }
    })
    .then(user => {
      if (!user) {
        return res.status(404).send({ success: false, message: "Error. User Not Found" });
      }
      return user
      .update(req.body) 
      .then((result) => res.status(200).send({ success: true, message: "Updated Successfully", data: result }))
      .catch(error => res.status(400).send({ success: false, message: "Error. Can't Update User", data: error }));
    })
    .catch(error => res.status(400).send({ success: false, message: "Error. Can't find User for update", data: error }));
  },
  /// ----------------
  /// ---- DELETE ----
  /// ----------------
  // Delete User by id
  delete(req, res) {
    if (isNaN(req.params.userId)) {
      return res.status(400).send({ success: false, message: "Error. userId must be a number" })
    }
    return User.findOne({
      where: { userId: req.params.userId }
    })
    .then(user => {
      if (!user) {
        return res.status(404).send({ success: false, message: "Error. User Not Found" });
      }
      return user
      .destroy({ returning: true, checkExistance: true })
      .then((result) => res.status(204).send({ success: true, message: "Successfully deleted the user!", data: result }))
      .catch(error => res.status(400).send({ success: false, message: "Error. Can't Delete User", data: error }));
    })
    .catch(error => res.status(400).send({ success: false, message: "Error. Can't find User for delete", data: error }));
  }
};
