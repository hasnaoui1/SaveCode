module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('Notification', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      message: { type: DataTypes.STRING, allowNull: false },
      isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    });
  
    Notification.associate = (models) => {
      Notification.belongsTo(models.User, { foreignKey: 'userId' });
    };
  
    return Notification;
  };