module.exports = function(io){
    io.on('connection', function(socket){ 
        console.log('socket connection on!');
        // socket.on('client message', function(data){
        //     io.emit('server message', data.message);
        // });
        socket.on('client message', function(data){
            console.log(data);
            io.emit('server message', data.message);
        });
    });
};