const Chat = require('./models/chat');
module.exports = function (io) {

    let users = {};
    io.on('connection', async (socket) => {
        console.log('New client connected');

        let messages = await Chat.find().sort({create_at: 'desc'}).limit(8).exec();
        socket.emit('load old msgs', messages);
        socket.on('send message', async(data, colback) => {
            let msg = data.trim();
            if (msg.substr(0, 3) === '/w ') {
                const msg1 = msg.substr(3);
                const index = msg1.indexOf(' ');
                if (index !== -1) {
                    const name = msg1.substring(0, index);
                    const msg = msg1.substring(index + 1);
                    if (name in users) {
                        users[name].emit('whisper', {
                            msg,
                            nick: socket.nickname
                        });
                    } else {
                        colback('Error! ingrese un usuario valido');
                    }
                } else {
                    colback('Error! ingrese su mensaje');
                }
            } else {
                const newMsg = new Chat({
                    msg,
                    nick: socket.nickname
                });
                await newMsg.save();
                io.sockets.emit('new message', {
                    msg: data,
                    nick: socket.nickname
                });
            }
        });

        socket.on('new user', (data, callback) => {
            if(data in users){
                callback(false);
            }else{
                callback(true);
                socket.nickname = data;
                users[socket.nickname] = socket;
                updateNicknames();
            }
        });
        socket.on('disconnect', (data) => {
            if(!socket.nickname) return;
            delete users[socket.nickname];
            updateNicknames();
        });

        function updateNicknames(){
            io.sockets.emit('usernames', Object.keys(users));
        }
    });
};

