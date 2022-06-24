/* eslint-disable import/first */
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
// import helmet from 'helmet';
// import http from 'http';
// import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import { errors } from '../src/service/error';
import { pageNotFound } from './service/userService';
import { googleRoutes } from './router/googleRoutes';
import { friendRequestRoutes } from './router/conversationRouter';
import { messageRoutes } from './router/messageRouter';

import { userRoutes } from '../src/router/userRouter';
import './controller/passport';
// import db from '../models';

dotenv.config();

export const app = express();
// eslint-disable-next-line import/first
// eslint-disable-next-line import/newline-after-import
import '.';
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.json());
// app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api/auth/user', userRoutes);
app.use('/', googleRoutes);
app.use('/api', friendRequestRoutes);
app.use('/api', messageRoutes);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/pages'));
app.use(express.static(`${__dirname}/views/pages`));
app.use(express.static(`${__dirname}/views/image`));
app.use(express.static(`${__dirname}/views/css`));
app.use(express.static(`${__dirname}/views/js`));
app.use('/*', pageNotFound);
app.use(errors);
// eslint-disable-next-line prefer-destructuring
// const port = process.env.PORT;

// app.listen(port, async () => {
//   await db.sequelize
//     .authenticate({ logging: false })
//     .then(() => {
//       console.log('database connected successfully');
//     })
//     .catch(() => {
//       console.log('database not connected');
//     });
//   console.log(`server live at ${port}`);
// });
