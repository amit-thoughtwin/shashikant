module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('messages', 'isDeleted', {
    type: Sequelize.DataTypes.BOOLEAN,
    defaultValue: false,
  }),
  down: (queryInterface) => queryInterface.dropTable('messages'),
};
