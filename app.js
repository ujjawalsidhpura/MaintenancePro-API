//App setup
require('dotenv').config()
const express = require('express');
const path = require('path');
const app = express();
const debug = require('debug')('backend:server');
const http = require('http');
const port = process.env.PORT || '3000';
const server = http.createServer(app);
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const logger = require('morgan');
const cors = require('cors');
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});
//Middleware setup
app.set('port', port);
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
// const storage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 			cb(null, 'public')
// 	},
// 	filename: (req, file, cb) => {
// 			cb(null, Date.now() + '-' + file.originalname)
// 	}
// });

// const upload = multer({storage}).array('file');


//Mongo Connection
const mongoDb = require('./mongoDb');

mongoDb.connectToServer(function (err) {
  //App goes online once this callback occurs

  //Main Routes
  const workorderRouter = require('./routes/workorder');
  const inventoryRouter = require('./routes/inventory');
  const usersRouter = require('./routes/users');
  const todayRouter = require('./routes/today_at_glance');
  const messagesRouter = require('./routes/message');
  app.use('/workorder', workorderRouter);
  app.use('/inventory', inventoryRouter);
  app.use('/users', usersRouter);
  app.use('/today', todayRouter);
  app.use('/messages', messagesRouter);

  //Handle 404 
  app.use(function (req, res, next) {
    next(createError(404));
  });

  //Handle 500
  app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500).send('Error')
  });

})

io.on('connection', socket => {
  socket.on('message', ({name, message}) => {
    io.emit('message', { name, message });
  })
})
//Start Server
server.listen(port, () => {
  console.log('App listening at ' + port)
});

module.exports = app;
