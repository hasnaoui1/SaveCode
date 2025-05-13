module.exports = (sequelize, DataTypes) => {
    const Collaboration = sequelize.define('Collaboration', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      sessionId: { type: DataTypes.STRING, allowNull: false },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    });
  
    Collaboration.associate = (models) => {
      Collaboration.belongsTo(models.User, { foreignKey: 'createdBy' });
    };
  
    return Collaboration;
  };