// var test = function(a, b){
//     return {
//         message: "hello",
//         value:"world"
//     }
// }

// var test = (a,b) => {
//     return {
//         message: "hello",
//         value:"world"
//     }
// }

// var test = (a, b) => ({
//     message: "hello",
//     value:"world"
// })

// //인자가 하나있는경우
// var test = a => ({
//     message: "hello",
//     value:"world"
// })

//PROMISE 1
/*
var p1 = new Promise(function(resolve, reject){
    console.log("프로미스 함수제작");

    //0.5초 뒤 콘솔에 찍는다
    setTimeout(function(){
        resolve({ p1 : " ^_^7 "}); //처리하고 싶은 부분을 resolve에 놓고
    }, 500);
});


p1.then( (result) => { // resolve가 실행된 후 then 이 실행됨
    console.log("리턴값 출력" + result.p1);
});
*/

//PROMISE all
var p1 = new Promise(function(resolve, reject){
    console.log("프로미스 함수제작");

    //0.5초 뒤 콘솔에 찍는다
    setTimeout(function(){
        resolve({ p1 : " ^_^7 "}); //처리하고 싶은 부분을 resolve에 놓고
    }, 500);
});

var p2 = new Promise(
    function(resolve, reject) {
        console.log("프라미스 함수제작");
        //0.3초 뒤에 콘솔에 찍습니다.
        setTimeout(
            function() {
                resolve({ p2 : "-_-" });
            }, 300 );
    }
);

Promise.all([p1,p2]).then( (result) => {
    console.log(result);
    console.log("p1 = " + result[0].p1);
    console.log("p2 = " + result[1].p2);
});