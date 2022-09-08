$(function(){

    const socket = io();

    //obtener elemntos del DOM de la interfaz
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');
    const $boton = $('.send_btn');

    //obtener elementos del DOM de los usuarios
    const $nickForm = $('#nickForm');
    const $nickError = $('#nickError');
    const $nickname = $('#nickname');

    const $users = $('#usernames');

    $nickForm.submit(e => {
        e.preventDefault();
        socket.emit('new user', $nickname.val(), data => {
            if(data){
                $('#nickWrap').hide();
                $('#contentWrap').show();
            }else{
                $nickError.html(`
                    <div class="alert alert-danger">
                        El usuario ya existe!
                    </div>
                `);
            }
            $nickname.val('');
        })
    });

    socket.on('usernames', data => {
        let html = '';
        for (let dato of data){
            html += `<p><i class="fas fa-user"></i> ${dato}</p>`;
        }
        $users.html(html);
    })

    
    //events

    $messageForm.submit(e => {
        e.preventDefault();
    });

    $boton.click(function(){
        socket.emit('send message', $messageBox.val(), data => {
            $chat.append(`<p class="error">${data}</p>`);
        });
        $messageBox.val('');
    });

    socket.on('new message', function(data){
         displayMsg(data);
    });

    socket.on('whisper', data => {
        $chat.append(`<p class="whisper"><b>${data.nick}</b>: ${data.msg}</p>`);
    });

    socket.on('load old msgs', data => {
        for (let msg of data){
            displayMsg(msg);
        }
    });

    const displayMsg = (data) => {
        $chat.append('<div class="message"><b>' + data.nick + '</b> : ' + data.msg + '</div>');
    }
})


