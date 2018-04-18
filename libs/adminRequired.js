module.exports = function(req, res, next){
    if(!req.isAuthenticated()){
        res.redirect('/accounts/login');
    }else{
        if(req.user.username != "admin"){
            //로그인 아이디가 어드민이 아닐 경우
            res.send('<script>alert("관리자만 접근 가능합니다."); location.href="/accounts/login"</script>');
        }else{
            return next();
        }
    }
};