module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('users', 'isOnline', {
    type: Sequelize.DataTypes.BOOLEAN,
    defaultValue: false,
  }),
  down: (queryInterface) => queryInterface.dropTable('users'),
};
