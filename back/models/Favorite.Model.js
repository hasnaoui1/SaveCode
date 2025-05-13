module.exports = (sequelize, DataTypes) => {
    const Favorite = sequelize.define('Favorite', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    });
  
    Favorite.associate = (models) => {
      Favorite.belongsTo(models.User, { foreignKey: 'userId' });
      Favorite.belongsTo(models.Snippet, { foreignKey: 'snippetId' });
    };
  
    return Favorite;
  };