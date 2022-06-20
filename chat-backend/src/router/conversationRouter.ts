import express from 'express';
import { tokenVarify } from '../service/userService';
import {
  friendRequestAccept,
  sendFriendRequest,
  seeFriendRequest,
  friendRequestReject,
  blockMessage,
  unFriend,
} from '../controller/conversationController';

export const friendRequestRoutes = express.Router();

friendRequestRoutes.get('/sendRequest/:id', tokenVarify, sendFriendRequest);
friendRequestRoutes.get('/friendrequest', tokenVarify, seeFriendRequest);
friendRequestRoutes.get('/acceptRequest/:id', tokenVarify, friendRequestAccept);
friendRequestRoutes.get('/reject/:id', tokenVarify, friendRequestReject);
friendRequestRoutes.get('/user/block/:id', tokenVarify, blockMessage);
friendRequestRoutes.get('/user/unFriend/:id', tokenVarify, unFriend);
