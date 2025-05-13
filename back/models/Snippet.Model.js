module.exports = (sequelize, DataTypes) => {
    const Snippet = sequelize.define('Snippet', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: DataTypes.STRING, allowNull: true, defaultValue: "untitled" },

      code: { type: DataTypes.TEXT, allowNull: true },
      language: { type: DataTypes.STRING, allowNull: true },
      isPublic: { type: DataTypes.BOOLEAN, defaultValue: true },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    });
  
    Snippet.associate = (models) => {
      Snippet.belongsTo(models.User, { foreignKey: 'userId' });
      Snippet.hasMany(models.Comment, { foreignKey: 'snippetId' });
      Snippet.hasMany(models.Execution, { foreignKey: 'snippetId' });
      Snippet.hasMany(models.Version, { foreignKey: 'snippetId' });
      Snippet.hasMany(models.Favorite, { foreignKey: 'snippetId' });
    };
  
    return Snippet;
  };