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

var admin = require('./routes/admin');
var contacts = require('./routes/contacts');
var accounts = require('./routes/accounts');
var auth = require('./routes/auth');

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
 
app.get('/', function (req, res) {
  res.send('ROOT page');
}); 

//Router use
app.use('/admin', admin); //middleware
app.use('/contacts', contacts);
app.use('/accounts', accounts);
app.use('/auth', auth);

app.listen( port, function(){
    console.log('Express listening on port', port);
});