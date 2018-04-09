module.exports = function(io){
    io.on('connection', function(socket){ 
        console.log('socket connection on!');
        // socket.on('client message', function(data){
        //     io.emit('server message', data.message);
        // });
        // socket.on('client message', function(data){
        //     console.log(data);
        //     io.emit('server message', data.message);
        // });
        
        //아래 두줄로 passport의 req.user의 데이터에 접근한다.
        var session = socket.request.session.passport;
        var user = (typeof session !== 'undefined') ? ( session.user ) : "";
 
        //사용자 명과 메시지를 같이 반환한다.
        socket.on('client message', function(data){
            io.emit('server message', { message : data.message , displayname : user.displayname });
        });
    });
};