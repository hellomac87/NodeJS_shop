var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

//생성될 필드명을 정한다.
var ContactsSchema = new Schema({
    title:{ //제품명
        type: String,
        required:[true, '제목을 입력하세요.']
    }, 
    email:{ //이메일주소
        type: String,
        required:[true, "이메일 주소를 입력해 주세요"]
    }, 
    description:{
        type: String,
        required:[true, '내용을 입력해 주세요']
    }, //설명
    created_at:{ //작성일 자동
        type: Date,
        default: Date.now()
    }
});
 
//virtual 변수는 호출되면 실행하는 함수
// Object create 의 get과 set과 비슷함
//set은 변수의 값을 바꾸거나 셋팅하면 호출
// get은 getDate변수를 호출하는 순간 날짜 월일이 찍힌다.
ContactsSchema.virtual('getDate').get(function(){
    var date = new Date(this.created_at);
    return {
        year : date.getFullYear(),
        month : date.getMonth()+1,
        day : date.getDate()
    };
});

// 1씩 증가하는 primary Key를 만든다
// model : 생성할 document 이름
// field : primary key , startAt : 1부터 시작
ContactsSchema.plugin( autoIncrement.plugin , 
    { model : 'contacts' , field : 'id' , startAt : 1 });
module.exports = mongoose.model('contacts', ContactsSchema);
 