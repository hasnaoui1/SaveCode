module.exports = (sequelize, DataTypes) => {
    const Version = sequelize.define('Version', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      versionNumber: { type: DataTypes.INTEGER, allowNull: false },
      changes: { type: DataTypes.TEXT },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    });
  
    Version.associate = (models) => {
      Version.belongsTo(models.Snippet, { foreignKey: 'snippetId' });
      Version.belongsTo(models.Version, { foreignKey: 'previousVersionId', allowNull: true });
    };
  
    return Version;
  };