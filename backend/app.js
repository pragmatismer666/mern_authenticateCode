const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const socket = require("socket.io");

require('dotenv').config();

const app = express();
app.use(passport.initialize());

require('./passport')(passport);

const port = process.env.PORT || 5000;

//connect to the database
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => console.log(`Database connected successfully`))
  .catch(err => console.log(err));

//since mongoose promise is depreciated, we overide it with node's promise
mongoose.Promise = global.Promise;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

try {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  const io = socket(server, { cors: { origin: '*' } });
  var websocket = [];
  io.on('connection', function(socket){
    websocket.push(socket);
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('User Disconnected');
    });
    
    socket.on('message', function(msg){
      console.log('message: ' + msg);
    });
  });

  app.use((req, res, next) => {
    req.io = websocket;
    next();
  });

  app.use(require('./routes'));

  app.use((err, req, res, next) => {
    console.log(err);
    next();
  });

} catch (error) {
  console.log(error);
}