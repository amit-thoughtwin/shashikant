import { Op } from 'sequelize';
import { Response, NextFunction } from 'express';
import { v4 as uuid, validate } from 'uuid';
import { ApiError } from '../service/error';
// import io from '../socketClient';
import { getAllUser } from './userController';
// import io from '../index';

// console.log('i am io');
// console.log(io);

const { messages, conversation, users } = require('../../models');

export const sendMessage = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const myId = uuid();
    const { message } = req.body;
    const numberId: any = id.replace(/[' "]+/g, '');
    const checkId = validate(numberId);

    const userId = req.id;

    if (checkId === false) {
      return next(new ApiError('please put valid id ', 400));
    }
    if (message.length === 0) {
      return res.json({
        statusCode: 400,
        message: 'message not be empty',
      });
    }
    const messageTrim: string = message.trim();
    const cheackFriend = await conversation.findOne({
      where: {
        senderId: { [Op.or]: [req.id, numberId] },
        recieverId: { [Op.or]: [req.id, numberId] },
      },
      include: [
        {
          model: users,
          attributes: ['fullName'],
          as: 'reciever',
        },
        {
          model: users,
          attributes: ['fullName'],
          as: 'sender',
        },
      ],
    });
    if (!cheackFriend) {
      return next(new ApiError('you are not friend', 404));
    }
    const value = cheackFriend.state;
    if (req.id === numberId) {
      return res.json({
        statusCode: 400,
        message: 'sender and reciever are not  same ',
      });
    }
    if (value === 'blocked') {
      return res.render('test', {
        data: [],
        userId: req.id,
        conversationId: '',
        chatWith: '',
        seeRequest: '',
        showmessages: [],
        userName: req.fullName,
        sendMessage: '',
        recieverId: numberId,
        friendRequest: '',
        message: 'blocked user can not send message',
      });
    }
    if (value === 'pending') {
      return res.json({
        statusCode: 400,
        message: 'you are not friend',
      });
    }
    if (value === 'unfriend') {
      return res.json({
        statusCode: 400,
        message: 'you are unfriend',
      });
    }

    const createData = await messages.create({
      id: myId,
      to: numberId,
      from: req.id,
      conversationId: cheackFriend.id,
      message: messageTrim,
      state: 'unedited',
    });
    const io = req.app.get('io');
    io.emit('chat-message', {
      msg: createData.message,
      conversationId: cheackFriend.id,
      userId: req.id,
      recieverId: numberId,
    });
    const messageData = await messages.findAll({
      where: {
        to: {
          [Op.or]: [numberId, req.id],
        },
        from: {
          [Op.or]: [numberId, req.id],
        },
      },
      order: [['createdAt', 'ASC']],
      include: [
        {
          model: users,
          as: 'reciever',
          attributes: ['fullName', 'id'],
        },
        {
          model: users,
          as: 'sender',
          attributes: ['fullName', 'id'],
        },
      ],
    });

    const { userData } = await getAllUser(userId);

    // await messages.update(
    //   { state: 'read' },
    //   {
    //     where: {
    //       to: {
    //         [Op.or]: [req.id, numberId],
    //       },
    //       from: {
    //         [Op.or]: [req.id, numberId],
    //       },
    //     },
    //   },
    // );

    messageData.forEach((element) => {
      let timeZone = '';
      if (element.createdAt.getHours() > 12) {
        timeZone += `${element.createdAt.getHours()}:${element.createdAt.getMinutes()}pm`;
      } else {
        timeZone += `${element.createdAt.getHours()}:${element.createdAt.getMinutes()}am`;
        // timeZone = "am"
      }
      element.timeZone = timeZone;
      //  timeZone = ""
      return element;
    });
    return res.render('test', {
      data: userData,
      userId: req.id,
      conversationId: '',
      userName: req.fullName,
      chatWith: cheackFriend.sender.fullName,
      friendRequest: '',
      seeRequest: '',
      message: '',
      showmessages: messageData,
      sendMessage: '',
      recieverId: numberId,
    });
  } catch (e: any) {
    console.log(e);
    return next(new ApiError(e.message, 404));
  }
};

export const seeMessages = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const numberId: any = id.replace(/[' "]+/g, '');
    const checkId = validate(numberId);
    const userId = req.id;
    if (checkId === false) {
      return next(new ApiError('please put valid id ', 400));
    }

    const { userData } = await getAllUser(userId);
    await messages.update(
      { state: 'read' },
      {
        where: {
          to: {
            [Op.or]: [req.id, numberId],
          },
          from: {
            [Op.or]: [req.id, numberId],
          },
        },
      },
    );
    const io = req.app.get('io');
    io.emit('seen-messages', {
      senderId: req.id,
      recieverId: numberId,
    });
    const messageData = await messages.findAll({
      where: {
        to: {
          [Op.or]: [numberId, req.id],
        },
        from: {
          [Op.or]: [numberId, req.id],
        },
      },
      order: [['createdAt', 'ASC']],
      include: [
        {
          model: users,
          as: 'reciever',
          attributes: ['fullName', 'id'],
        },
        {
          model: users,
          as: 'sender',
          attributes: ['fullName', 'id'],
        },
      ],
    });
    messageData.forEach((element) => {
      let timeZone = '';
      if (element.createdAt.getHours() > 12) {
        timeZone += `${element.createdAt.getHours()}:${element.createdAt.getMinutes()}pm`;
      } else {
        timeZone += `${element.createdAt.getHours()}:${element.createdAt.getMinutes()}am`;
        // timeZone = "am"
      }
      element.timeZone = timeZone;
      //  timeZone = ""
      return element;
    });

    if (!messageData) {
      return res.json({
        statusCode: 200,
        message: 'no chat found',
      });
    }

    const loginId = req.id;
    const otherUser = id;
    const user = await users.findOne({
      where: {
        id: otherUser,
      },
    });

    return res.render('test', {
      data: userData,
      userId: loginId,
      conversationId: '',
      userName: req.fullName,
      chatWith: user.fullName,
      friendRequest: '',
      seeRequest: '',
      message: '',
      showmessages: messageData,
      sendMessage: '',
      recieverId: otherUser,
    });
  } catch (e: any) {
    return next(new ApiError(e.message, 404));
  }
};

export const deleteChats = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { recieverId } = req.query;
    const numberId: any = id.replace(/[' "]+/g, '');
    const checkId = validate(numberId);
    if (checkId === false) {
      return next(new ApiError('please put valid id ', 400));
    }
    const messageData = await messages.findOne({
      where: {
        id: numberId,

      },
    });

    if (!messageData) {
      return res.json({
        statusCode: 404,
        messages: 'no chat found ',
      });
    }
    if (messageData) {
      // const { conversationId } = messageData.dataValues;
      const io = req.app.get('io');
      io.emit('delete', {
        messageId: id,
      });
      await messages.destroy({
        where: {
          id,
        },
      });
      return res.redirect(`/api/conversation/message/${recieverId}`);
      // return res.json({
      //   statusCode: 200,
      //   message: 'chat deleted successfully',
      // });
    }
  } catch (e: any) {
    return next(new ApiError(e.message, 400));
  }
  return true;
};

export const deleteAllChat = async (req: any, res: Response) => {
  try {
    const messageData = await messages.findAll({
      where: {
        from: req.id,
      },
    });

    if (messageData.length === 0) {
      return res.json({
        statusCode: 'no chat found',
      });
    }

    if (messageData) {
      const checkMessage = messageData.dataValues.messages;
      if (checkMessage.length === 0) {
        return res.json({
          statusCode: 400,
          message: 'chats already deleted',
        });
      }
      await messages.destroy({
        where: {
          from: req.id,
        },
      });
      return res.json({
        statusCode: 400,
        messages: 'all chat deleted successfully',
      });
    }
  } catch (e: any) {
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
  return true;
};

export const editmessage = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { recieverId } = req.query;
    // const loginId = req.id;
    // const userId = req.id;
    const numberId: any = id.replace(/[' "]+/g, '');
    const checkId = validate(numberId);
    if (checkId === false) {
      return next(new ApiError('please put valid id ', 400));
    }
    // const { userData } = await getAllUser(userId);
    const { message }: { message: string } = req.body;
    if (!message) {
      return res.json({
        statusCode: 400,
        message: 'message is required',
      });
    }
    if (message.length === 0) {
      return res.json({
        statusCode: 400,
        message: 'message not be empty',
      });
    }
    const messageTrim: string = message.trim();

    const messageData = await messages.findOne({
      where: {
        id: numberId,
      },
    });

    if (!messageData) {
      return res.json({
        statusCode: 400,
        message: 'no chat found',
      });
    }
    // const messageId = messageData.from;
    // if (messageId !== req.id) {
    //   return res.json({
    //     statusCode: 400,
    //     message: 'you can not edit message',
    //   });
    // }
    console.log(numberId);

    await messages.update(
      {
        message: messageTrim,
        state: 'edited',
        isEdited: true,
      },
      {
        where: {
          id: numberId,
        },
      },
    );
    const io = req.app.get('io');
    io.emit('edit', {
      messageId: numberId,
      message: messageTrim,
      status: 'edited',
    });

    return res.redirect(`/api/conversation/message/${recieverId}`);
    // const messagesData = await messages.findAll({
    //   where: {
    //     to: {
    //       [Op.or]: [recieverId, req.id],
    //     },
    //     from: {
    //       [Op.or]: [recieverId, req.id],
    //     },
    //   },
    //   order: [['createdAt', 'ASC']],
    //   include: [
    //     {
    //       model: users,
    //       as: 'reciever',
    //       attributes: ['fullName', 'id'],
    //     },
    //     {
    //       model: users,
    //       as: 'sender',
    //       attributes: ['fullName', 'id'],
    //     },
    //   ],
    // });
    // messagesData.forEach((element) => {
    //   let timeZone = '';
    //   if (element.createdAt.getHours() > 12) {
    //     timeZone += `${element.createdAt.getHours()}:${element.createdAt.getMinutes()}pm`;
    //   } else {
    //     timeZone += `${element.createdAt.getHours()}:${element.createdAt.getMinutes()}am`;
    //     // timeZone = "am"
    //   }
    //   element.timeZone = timeZone;
    //   //  timeZone = ""
    //   return element;
    // });
    // const user = await users.findOne({
    //   where: {
    //     id: recieverId,
    //   },
    // });
    // console.log(messagesData);

    // const io = req.app.get('io');
    // io.emit('edit', {
    //   messageId: numberId,
    //   message: messageTrim,
    //   status: 'edited',
    // });
    // return res.render('test', {
    //   data: userData,
    //   userId: loginId,
    //   conversationId: '',
    //   userName: req.fullName,
    //   chatWith: user.fullName,
    //   friendRequest: '',
    //   seeRequest: '',
    //   message: '',
    //   showmessages: messagesData,
    //   sendMessage: '',
    //   recieverId,
    // });

    // return res.json({
    //   statusCode: 200,
    //   message: 'message edited successfully',
    // });
  } catch (e: any) {
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};
