module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.ENUM('admin', 'user'), default:'user' },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    });
  
    User.associate = (models) => {
      User.hasMany(models.Snippet, { foreignKey: 'userId' });
      User.hasMany(models.Notification, { foreignKey: 'userId' });
      User.hasMany(models.Favorite, { foreignKey: 'userId' });
      User.hasMany(models.Comment, { foreignKey: 'userId' });
    };
  
    return User;
  };