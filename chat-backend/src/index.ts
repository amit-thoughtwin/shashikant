// import { app } from "./app";
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
// import { app } from './app';
import db from '../models/index';

import { app } from './app';

const port = process.env.PORT;

// app.listen(port, () => {
//   console.log(`server live at ${port}`);
// });

const server = http.createServer(app);
const io = new Server(server);

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

io.on('connection', (socket) => {
  // socket.send("connected")
  console.log('connected');

  socket.on('disconnect', () => {
    console.log('Disconnected');
  });

  // socket.on("join-room",(conversationId)=>{
  // socket.join(conversationId)
  // })

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

export default io;
