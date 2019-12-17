'use strict';
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    codeId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    webUrl: DataTypes.STRING,
    eventDate: DataTypes.DATE
  }, {});
  Event.associate = function(models) {
    // associations can be defined here
  };
  return Event;
};