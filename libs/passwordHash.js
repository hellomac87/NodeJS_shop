//암호화 모듈 작성
var crypto = require('crypto');
var mysalt = 'hellomac87';

module.exports = function(password){
    return crypto.createHash('sha512').update( password + mysalt ).digest('base64');
}