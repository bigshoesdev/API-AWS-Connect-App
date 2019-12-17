'use strict';
module.exports = (sequelize, DataTypes) => {
  const Match = sequelize.define('Match', {
    userId: DataTypes.INTEGER,
    codeId: DataTypes.INTEGER
  }, {});
  Match.associate = function(models) {
  	// associations can be defined here
  };
  return Match;
};