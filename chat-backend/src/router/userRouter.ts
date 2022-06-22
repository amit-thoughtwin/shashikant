import express, { Response } from 'express';
// import jwt from 'jsonwebtoken';
import {
  userSignupValidation,
  userOtpValidation,
} from '../middleware/userSignupLoginValidation';
import {
  signup,
  logOut,
  searchFriend,
  searchFriendForSpecificUser,
} from '../controller/userController';
import { userVerifiedEmail, tokenVarify } from '../service/userService';

// const socket = require('../socketIo');

export const userRoutes = express.Router();

userRoutes.post('/signup', userSignupValidation, signup);

userRoutes.get('/login', async (req: any, res: Response) => res.render('login', {
  msg: ' ',
}));

// const token = req.cookies.access_token;
// const secretKey:any = process.env.SECRET_KEY;
// let userId:any;
// if (token) {
//   const io = req.app.get('io');
//   io.emit('login', {
//     userId: req.id,
//   });

//   await jwt.verify(token, secretKey, async (error: any, payload: any) => {
//     if (payload) {
//       console.log(payload.fullName);
//       userId = payload.id;
//       req.fullName = payload.fullName;
//     }
//   });
//   const loginId = userId;
//   const { userData } = await getAllUser(userId);
//   const friendRequests = await friendRequestCount(userId);
//   return res.render('test', {
//     data: userData,
//     userId: loginId,
//     userName: req.fullName,
//     conversationId: '',
//     chatWith: '',
//     showmessages: [],
//     sendMessage: '',
//     recieverId: '',
//     message: '',
//     friendRequest: '',
//     seeRequest: friendRequests,
//   });

userRoutes.post('/verifyEmail', userOtpValidation, userVerifiedEmail);
userRoutes.get('/email', (_, res: Response) => {
  res.render('verifyemail');
  return true;
});

userRoutes.get('/searchFriend', tokenVarify, searchFriend);

userRoutes.get(
  '/searchFriendForSpecificUser',
  tokenVarify,
  searchFriendForSpecificUser,
);

userRoutes.get('/logOut', logOut);
