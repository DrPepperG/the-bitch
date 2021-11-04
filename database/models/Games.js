module.exports = (sequelize, DataTypes) => {
    return sequelize.define('games', {
        name: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        data: {
            type: DataTypes.JSON,
            allowNull: false,
        },
    });
};
