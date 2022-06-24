import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { Op } from 'sequelize';
import { v4 as uuid } from 'uuid';
import { ApiError } from '../service/error';
import { html, createOtp } from '../service/otpTemplate';
import { sendMail } from '../service/userService';

// const socket = require('../socketIo');
const { users, conversation, messages } = require('../../models');

dotenv.config();

const ngrokUrl = process.env.NGROKBASEURL;

export const friendRequestCount = async (userId: any) => {
  const userData = await conversation.findAll({
    where: {
      recieverId: userId,
      state: 'pending',
    },
    attributes: ['senderId'],
    include: [
      {
        model: users,
        attributes: ['email', 'fullName', 'id'],
        as: 'sender',
      },
    ],
  });
  return userData;
};

export const getAllUser = async (userId: any) => {
  let myobj;
  const conversationData = await conversation.findAll({
    where: {
      [Op.or]: [
        {
          senderId: userId,
        },
        {
          recieverId: userId,
        },
      ],
      state: ['accepted', 'blocked'],
    },
  });

  if (conversationData.length <= 0) {
    myobj = {
      userData: [],
      conversationId: null,
    };
    return myobj;
  }
  const otherIds: any = [];
  if (conversationData.length > 0) {
    conversationData.map((element) => {
      if (element.senderId === userId) {
        otherIds.push(element.recieverId);
      } else {
        otherIds.push(element.senderId);
      }
      return true;
    });

    const userData = await users.findAll({
      where: {
        id: otherIds,
      },
    });

    for (let i = 0; i < userData.length; i += 1) {
      const lastMessage = await messages.findAll({
        limit: 1,
        where: {
          to: {
            [Op.or]: [userId, userData[i].id],
          },
          from: {
            [Op.or]: [userId, userData[i].id],
          },
        },
        order: [['createdAt', 'DESC']],
      });

      if (lastMessage[0]) {
        userData[i].lastMessage = lastMessage[0].message;
      }
    }
    myobj = {
      userData,
    };
    return myobj;
  }

  return true;
};

export const signup = async (req: any, res:Response, next: NextFunction) => {
  try {
    const myId = uuid();
    const secretKey: any = process.env.SECRET_KEY;
    const otpExp = new Date(new Date().getTime() + 5 * 60000);
    const { email, password }: { email: string; password: string } = req.body;
    const emailTrim = email.trim();
    const passwordTrim = password.trim();
    const salt: any = await bcrypt.genSalt(10);
    const hash: string = await bcrypt.hash(passwordTrim, salt);
    const findData = await users.findOne({
      where: {
        email: emailTrim,
      },
    });

    if (!findData) {
      let realOtp = createOtp();
      await users.create({
        fullName: null,
        email: emailTrim,
        password: hash,
        id: myId,
      });
      const findCreateData = await users.findOne({
        where: { email: emailTrim },
      });
      await users.update(
        { otp: realOtp, otpExpTime: otpExp },
        {
          where: {
            email: emailTrim,
          },
        },
      );
      await sendMail(req, res, html(realOtp));
      const databasePassword = findCreateData.dataValues.password;
      const passwordMatch = await bcrypt.compare(
        passwordTrim,
        databasePassword,
      );
      const values = findCreateData.dataValues.isVerified;
      if (!passwordMatch) {
        return res.render('login', { msg: 'invalid credential', url: '' });
      }
      if (values === false) {
        return res.render('verifyemail', {
          msg: 'otp will be send on email',
          password: passwordTrim,
        });
      }
    } else {
      const loginPassword = findData.dataValues.password;
      const loginId = findData.dataValues.id;
      const verified = findData.dataValues.isVerified;
      const passwordMatch = await bcrypt.compare(passwordTrim, loginPassword);
      let realOtp = createOtp();
      const originalData = await users.findOne({
        where: {
          email: emailTrim,
        },
      });
      const checkVerify = originalData.isVerified;
      if (checkVerify === false) {
        await sendMail(req, res, html(realOtp));

        await users.update(
          { otp: realOtp, otpExpTime: otpExp },
          {
            where: {
              email: emailTrim,
            },
          },
        );
      }
      if (!passwordMatch) {
        return res.render('login', { msg: 'invalid credential', url: '' });
        // return next(new ApiError("Invalid credential", 400));
      }
      if (verified === false) {
        const result = `${ngrokUrl}/api/verifyEmail`;
        const data = result.replace(/ /g, '');
        return res.render('verifyemail', {
          msg: 'otp will be send on email',
          urt: data,
          password: passwordTrim,
        });
      }

      if (verified === true) {
        if (findData.fullName === null) {
          const { fullName }: { fullName: string } = req.body;
          if (!fullName) {
            return res.render('login2', {
              msg: 'fullName is required',
              url: '',
              email: '',
              password: '',
            });
          }
          if (fullName.length < 3) {
            return res.render('login2', {
              msg: 'charcter lenght should be 3',
              url: '',
              email: '',
              password: '',
            });
          }
          const fullNameTrim: string = fullName.trim();
          await users.update(
            { fullName: fullNameTrim },
            {
              where: {
                email,
              },
            },
          );
          const fullNameFind = await users.findOne({
            where: {
              email: emailTrim,
            },
          });
          const jwtToken = jwt.sign(
            { id: loginId, fullName: fullNameFind.fullName },
            secretKey,
            {
              expiresIn: '1d',
            },
          );
          res.cookie('access_token', `${jwtToken}`, {
            expires: new Date(Date.now() + 9999999),
            httpOnly: false,
          });
          const io = req.app.get('io');
          console.log('>>>>>>>>', io.emit('login', {
            userId: req.id,
          }));

          // io.emit('login', {
          //   userId: req.id,
          // });

          const result = `${ngrokUrl}/api/auth/user/searchFriend`;
          const data = result.replace(/ /g, '');
          return res.redirect(data);
        }
        if (passwordMatch) {
          const jwtToken = jwt.sign(
            { id: loginId, fullName: findData.fullName },
            secretKey,
            {
              expiresIn: '1d',
            },
          );
          const io = req.app.get('io');
          res.cookie('access_token', `${jwtToken}`, {
            expires: new Date(Date.now() + 9999999),
            httpOnly: false,
          });
          io.emit('login', {
            userId: findData.id,
          });
          const result = `${ngrokUrl}/api/auth/user/searchFriend`;
          const data = result.replace(/ /g, '');
          return res.redirect(data);
        }
      }
    }
  } catch (e: any) {
    return next(new ApiError(e.message, 400));
  }
  return true;
};

export const logOut = async (req: any, res: Response) => {
  try {
    const result = `${ngrokUrl}/api/auth/user/login`;
    const data = result.replace(/ /g, '');
    const secretKey:any = process.env.SECRET_KEY;
    const token = req.cookies.access_token;
    await jwt.verify(token, secretKey, async (error: any, payload: any) => {
      if (payload) {
        console.log(payload.fullName);
        req.id = payload.id;
      }
      const io = req.app.get('io');
      io.emit('logOut', {
        userId: req.id,
      });

      return res.clearCookie('access_token').redirect(data);
    });
  } catch (e: any) {
    return res.json({
      statusCode: 400,
      msg: e.msg,
    });
  }
  return true;
};

export const searchFriendForSpecificUser = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { search } = req.query;
    if (search) {
      const originalSearch = search.replace(/[' "]+/g, '');
      const user = await users.findAll(
        {
          where: {
            id: {
              [Op.ne]: [req.id],
            },

            fullName: {
              [Op.iRegexp]: `${originalSearch}`,
            },
            isVerified: true,
          },
        },
        { attributes: ['email', 'fullName', 'id'] },
      );
      if (!user) {
        return res.json({
          statusCode: 200,
          data: [],
        });
      }

      return res.json({
        statusCode: 200,
        data: user,
      });
    }
  } catch (e: any) {
    return next(new ApiError(e.message, 400));
  }
  return true;
};
export const searchFriend = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.id;
    const loginId = req.id;
    const { userData } = await getAllUser(userId);
    const friendRequests = await friendRequestCount(userId);
    // return res.render('test', {
    //   data: userData,
    //   userId: loginId,
    //   userName: req.fullName,
    //   conversationId: '',
    //   chatWith: '',
    //   showmessages: [],
    //   sendMessage: '',
    //   recieverId: '',
    //   friendRequest: '',
    //   seeRequest: friendRequests,
    // });
    return res.render('test', {
      data: userData,
      userId: loginId,
      userName: req.fullName,
      conversationId: '',
      chatWith: '',
      showmessages: [],
      sendMessage: '',
      recieverId: '',
      message: '',
      friendRequest: '',
      seeRequest: friendRequests,
    });
  } catch (e: any) {
    return next(new ApiError(e.message, 400));
  }
};
