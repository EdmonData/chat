const http = require('http');
const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const port = 3000;// Numero Puerto pa el servidor

// db connection

mongoose.connect('mongodb://localhost/chat') 
    .then(db => console.log('db connected' + db))
    .catch(err => console.log(err));


app.set('port', process.env.PORT || port); // a la escucha del puertoque se le indique o sino usar el 3000

const { Server } = socketio;
const io = new Server(server);

require('./socket')(io);


// Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

//Iniciar el servidor
server.listen(app.get('port'), () => {
  console.log(`Sservidor corriendo en el puerto: ${app.get('port')}`);
});
