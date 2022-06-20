module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('messages', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      to: {
        type: Sequelize.UUID,
      },
      from: {
        type: Sequelize.UUID,
      },
      message: {
        type: Sequelize.STRING,
      },
      state: {
        type: Sequelize.ENUM('unedited', 'edited', 'read', 'unread'),
        defaultValue: 'unread',
      },
      conversationId: {
        type: Sequelize.UUID,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('messages');
  },
};
