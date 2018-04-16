var express = require('express');
var router = express.Router();
var ProductsModel = require('../models/ProductsModel');
var CommentsModel = require('../models/CommentsModel');
var CheckoutModel = require('../models/CheckoutModel');

var loginRequired = require('../libs/loginRequired');

var co = require('co');

var paginate = require('express-paginate');

// csrf 셋팅
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });

//이미지 저장되는 위치 설정
var path = require('path');
var uploadDir = path.join( __dirname , '../uploads' ); // 루트의 uploads위치에 저장한다.
var fs = require('fs');

//multer 셋팅
var multer  = require('multer');
var storage = multer.diskStorage({
    destination : function(req, file, callback){ //이미지가 저장되는 도착지 지정
        callback(null, uploadDir);
    },
    filename : function(req, file, callback){ //products-날짜.jpg[png] 저장
        callback(null, 'products-' + Date.now() + '.'+ file.mimetype.split('/')[1] );
    }
});
var upload = multer({ storage: storage });

/*
//미들웨어 개념
function testMiddleWare( req, res, next){
    console.log('testMiddleWare on!')
    next(); //다음 인자로 제어권을 넘긴다
}
function adminCheck( req, res, next){
    console.log('adminCheck on!')
    next();
}
router.get('/products', testMiddleWare, adminCheck,function(req, res){
    ProductsModel.find(function(err, products){
        res.render('admin/products',{products : products});
    });
});
*/
router.get('/', function(req, res){
    res.redirect('/products');
});

router.get('/products', paginate.middleware(3, 50), async (req,res) => {
 
    const [ results, itemCount ] = await Promise.all([
        ProductsModel.find().sort('-created_at').limit(req.query.limit).skip(req.skip).exec(),
        ProductsModel.count({})
    ]);
    const pageCount = Math.ceil(itemCount / req.query.limit);
    
    const pages = paginate.getArrayPages(req)( 4 , pageCount, req.query.page);
 
    res.render('admin/products', { 
        products : results , 
        pages: pages,
        pageCount : pageCount,
    });
 
});

router.get('/products/write', loginRequired, csrfProtection, function(req, res){
    res.render('admin/form',{ product : "", csrfToken : req.csrfToken()});
});
router.post('/products/write', loginRequired, upload.single('thumbnail'), csrfProtection, function(req, res){
    //console.log(req.file);
    var product = new ProductsModel({
        name : req.body.name,
        thumbnail : (req.file) ? req.file.filename : "",
        //thumbnail : (req.file)이 ? 있으면 얘로저장 req.file.filename : 없으면 얘로저장 "",(삼항연산자)
        price : req.body.price,
        description : req.body.description,
        username : req.user.username
    });
    
    if(!product.validateSync()){
        product.save(function(err){
            res.redirect('/admin/products');
        });    
    }else{
        res.send(product.validateSync());
    }
});
/*
router.get('/products/detail/:id', function(req, res){
    //url 에서 변수 값을 받아올떈 req.params.id 로 받아온다
    ProductsModel.findOne({'id':req.params.id}, function(err, product){
        CommentsModel.find({ product_id : req.params.id }, function(err, comments){
            res.render('admin/productsDetail', { product: product , comments : comments });
        });
    });
});
*/
router.get('/products/detail/:id' , function(req, res){
    var getData = async() => ({
            product: await ProductsModel.findOne({'id': req.params.id}).exec(),
            comments: await CommentsModel.find({'product_id':req.params.id}).exec() 
    });

    getData().then(function(result){
        res.render('admin/productsDetail', { product: result.product , comments : result.comments });
    }) 
});

//edit
router.get('/products/edit/:id', loginRequired, csrfProtection , function(req, res){
    ProductsModel.findOne({'id':req.params.id}, function(err, product){
        res.render('admin/form', { product : product, csrfToken : req.csrfToken()});
    });
});
router.post('/products/edit/:id', loginRequired, upload.single('thumbnail'), csrfProtection, function(req, res){
    //그전에 지정되 있는 파일명을 받아온다
    ProductsModel.findOne( {id : req.params.id} , function(err, product){

        if(req.file && product.thumnail){  //요청중에 파일이 존재 할시 이전이미지 지운다.
            fs.unlinkSync( uploadDir + '/' + product.thumbnail );
        }

        var query = {
            name : req.body.name,
            thumbnail : (req.file) ? req.file.filename : product.thumbnail,
            //thumbnail : 파일요청이 있다면 (req.file) ? 얘로 req.file.filename : 없다면 product.thumbnail,
            price : req.body.price,
            description : req.body.description
        };
        //update의 첫번째 인자는 조건, 두번째 인자는 바뀔 값들
        ProductsModel.update({ id : req.params.id }, { $set : query }, function(err){
            res.redirect('/admin/products/detail/' + req.params.id ); //수정후 본래보던 상세페이지로 이동
        });
    });
});
//Delete
router.get('/products/delete/:id', function(req, res){
    ProductsModel.remove({ id : req.params.id }, function(err){
        res.redirect('/admin/products');
    });
});

//comment router
router.post('/products/ajax_comment/insert', function(req, res){
    //res.json(req.body);
    var comment = new CommentsModel({
        content:req.body.content,
        product_id : parseInt(req.body.product_id)
    });
    comment.save(function(err, comment){
        res.json({ //json객체를 응답하기위해
            id : comment.id,
            content : comment.content,
            message : "success"
        });
    });
});

router.post('/products/ajax_comment/delete', function(req, res){
    CommentsModel.remove({ id : req.body.comment_id } , function(err){
        res.json({ message : "success" });
    });
});

//summernote 이미지 업로드 라우팅 구현
router.post('/products/ajax_summernote', loginRequired, upload.single('thumbnail'), function(req,res){
    res.send( '/uploads/' + req.file.filename);
});

//GET /admin/checkout 페이지 작성
router.get('/order', (req, res) => {
    CheckoutModel.find(function(err, orderList){
        res.render('admin/orderList', {orderList:orderList});
    })
});

//GET /admin/order/edit/:id 페이지 작성
router.get('/order/edit/:id', (req, res) =>{
    CheckoutModel.findOne( { id : req.params.id } , function(err, order){
        res.render( 'admin/orderForm' , 
            { order : order }
        );
    });
});

module.exports = router;