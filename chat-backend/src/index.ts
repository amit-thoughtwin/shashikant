// import { app } from "./app";
import dotenv from 'dotenv';
import http from 'http';
// import socketioJwt from 'socketio-jwt';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
// import { app } from './app';
import db from '../models/index';
import { app } from './app';

const { users } = require('../models');

const port = process.env.PORT;
const secretKey:any = process.env.SECRET_KEY;

const server = http.createServer(app);
const io = new Server(
  server,
  {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  },
  // {
  //   // path: '/socketio',
  //   transports: [
  //     'websocket',
  //   ],
  // },
);

dotenv.config();
server.listen(port, async () => {
  await db.sequelize
    .authenticate({ logging: false })
    .then(() => {
      console.log('database connected successfully');
    })
    .catch(() => {
      console.log('database not connected');
    });
  console.log(`server live at ${port}`);
});
// let User = {};
// io.use(socketioJwt.authorize({
//   secret: secretKey,
//   handshake: true,
//   auth_header_required: true,
// }));

io.on('connection', async (socket) => {
  let UserId: any;
  const token:any = socket.handshake.headers.cookie;
  if (token) {
    const myToken = token.split('=')[1];

    await jwt.verify(myToken, secretKey, async (error: any, payload: any) => {
      if (payload) {
        UserId = payload.id;
      }
    });

    console.log('connect');
    await users.update({
      isOnline: true,
    }, {
      where: {
        id: UserId,
      },
    });
    socket.broadcast.emit('online', UserId);
  }
  // socket.emit('online', UserId);
  // io.on('authenticated', (socket) => {
  //   console.log(socket.my_decoded_token); // new decoded token
  // });

  socket.on('disconnect', async () => {
    if (token) {
      const myToken = token.split('=')[1];

      await jwt.verify(myToken, secretKey, async (error: any, payload: any) => {
        if (payload) {
          UserId = payload.id;
        }
      });
      console.log('disconnect', UserId);

      await users.update({
        isOnline: false,
      }, {
        where: {
          id: UserId,
        },
      });
      socket.broadcast.emit('offline', UserId);
    }
  });
  socket.on('logOut', async (data) => {
    await users.update({
      isOnline: false,
    }, {
      where: {
        id: data.userId,
      },
    });
  });
  socket.on('typing', (msg) => {
    io.emit('typing', msg);
  });

  socket.on('stopTyping', (msg) => {
    io.emit('stopTyping', msg);
  });

  socket.on('chat-message', (data) => {
    const {
      msg, conversationId, userId, recieverId,
    } = data;
    io.emit('chat-message', {
      msg,
      conversationId,
      userId,
      recieverId,
    });
  });
  socket.on('sendRequest', (data) => {
    const { senderId, recieverId } = data;
    io.emit('sendRequest', {
      senderId,
      recieverId,
    });
  });
});

app.set('io', io);

// export default io;
