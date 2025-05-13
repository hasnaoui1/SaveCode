module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      content: { type: DataTypes.STRING, allowNull: false },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    });
  
    Comment.associate = (models) => {
      Comment.belongsTo(models.User, { foreignKey: 'userId' });
      Comment.belongsTo(models.Snippet, { foreignKey: 'snippetId' });
    };
  
    return Comment;
  };
  