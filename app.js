var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
//flash  메시지 관련
var flash = require('connect-flash');
 
//passport 로그인 관련
var passport = require('passport');
var session = require('express-session');

//MongoDB 접속
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;  //mongoose promise error 처리
var autoIncrement = require('mongoose-auto-increment');

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    console.log('mongodb connect');
});
var connect = mongoose.connect('mongodb://127.0.0.1:27017/fastcampus',
 { useMongoClient: true });
autoIncrement.initialize(connect);

var home = require('./routes/home');
var admin = require('./routes/admin');
var contacts = require('./routes/contacts');
var accounts = require('./routes/accounts');
var auth = require('./routes/auth');
var chat = require('./routes/chat');

var app = express();
var port = 3000;

// 확장자가 ejs 로 끈나는 뷰 엔진을 추가한다.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 미들웨어 셋팅 (라우팅 전 세팅 : ex)req변수를 사용하기 위해 라우팅 전에 세팅해야함
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//업로드 path 추가(static path add)
app.use('/uploads', express.static('uploads'));

//session 관련 셋팅
app.use(session({
    secret: 'fastcampus',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 2000 * 60 * 60 //지속시간 2시간
    }
}));
 
//passport 적용
app.use(passport.initialize());
app.use(passport.session());
 
//플래시 메시지 관련
app.use(flash());

//로그인 정보 뷰에서만 변수로 셋팅, 전체 미들웨어는 router위에 두어야 에러가 안난다
app.use(function(req, res, next) {
    //app.locals.myname = "이강산";
    app.locals.isLogin = req.isAuthenticated(); // isAuthenticated : passport 에서 제공하는 메서드
    //app.locals.urlparameter = req.url; //현재 url 정보를 보내고 싶으면 이와같이 셋팅
    //app.locals.userData = req.user; //사용 정보를 보내고 싶으면 이와같이 셋팅
    next();
});


//Router use
app.use('/', home);
app.use('/admin', admin); //middleware
app.use('/contacts', contacts);
app.use('/accounts', accounts);
app.use('/auth', auth);
app.use('/chat', chat);


var server = app.listen( port, function(){
    console.log('Express listening on port', port);
});
 
var listen = require('socket.io');
var io = listen(server);
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


// 8443번에 https적용 -------------
// var https = require('https');
// var fs = require('fs');
// var httpsServer = https.createServer(
//     {
//         key: fs.readFileSync('./ssl/localhost.key').toString(), 
//         cert: fs.readFileSync('./ssl/localhost.crt').toString()
//     }, 
// app ).listen(3000);