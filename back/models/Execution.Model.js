module.exports = (sequelize, DataTypes) => {
    const Execution = sequelize.define('Execution', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      input: { type: DataTypes.TEXT },
      output: { type: DataTypes.TEXT },
      executionTime: { type: DataTypes.FLOAT },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    });
  
    Execution.associate = (models) => {
      Execution.belongsTo(models.Snippet, { foreignKey: 'snippetId' });
    };
  
    return Execution;
  };