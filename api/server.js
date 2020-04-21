const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors');

const usersRouter = require('../users/users-router.js');
const authRouter = require('../auth/auth-router.js');
const authMiddleWare = require('../auth/auth-middleware.js');

const server = express();

const sessionConfig = {
    name: "Frodo",
    secret: process.env.SESSION_SECRET || "this is a secret!",
    resave: false,
    saveUninitialized: process.env.SEND_COOKIES || true,
    cookie: {
        maxAge: 1000 * 30,
        secure: process.env.USE_SECURE_COOKIES || false,
        httpOnly: true, 
    },
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use("/api/users", authMiddleWare, usersRouter);
server.use('/api/auth', authRouter);

server.get('/', (req, res) => {
    res.json({ api: "up!" });
});

module.exports = server;
