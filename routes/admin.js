var express = require('express');
var router = express.Router();
var ProductsModel = require('../models/ProductsModel');
var CommentsModel = require('../models/CommentsModel');

/*
//미들웨어 개념
function testMiddleWare( req, res, next){
    console.log('testMiddleWare on!')
    next();
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
    res.send('path : admin');
});

router.get('/products',function(req, res){
    ProductsModel.find(function(err, products){
        res.render('admin/products',{products : products});
    });
});
router.get('/products/write', function(req, res){
    res.render('admin/form',{ product : "" });
});
router.post('/products/write', function(req, res){
    var product = new ProductsModel({
        name : req.body.name,
        price : req.body.price,
        description : req.body.description
    });
    
    if(!product.validateSync()){
        product.save(function(err){
            res.redirect('/admin/products');
        });    
    }else{
        res.send(product.validateSync());
    }
});

router.get('/products/detail/:id', function(req, res){
    //url 에서 변수 값을 받아올떈 req.params.id 로 받아온다
    ProductsModel.findOne({'id':req.params.id}, function(err, product){
        CommentsModel.find({ product_id : req.params.id }, function(err, comments){
            res.render('admin/productsDetail', { product: product , comments : comments });
        });
    });
});

//edit
router.get('/products/edit/:id', function(req, res){
    ProductsModel.findOne({'id':req.params.id}, function(err, product){
        res.render('admin/form', { product : product });
    });
});
router.post('/products/edit/:id', function(req, res){
    var query = {
        name : req.body.name,
        price : req.body.price,
        description : req.body.description,
    };
    //update의 첫번째 인자는 조건, 두번째 인자는 바뀔 값들
    ProductsModel.update({ id : req.params.id }, { $set : query }, function(err){
        res.redirect('/admin/products/detail/' + req.params.id ); //수정후 본래보던 상세페이지로 이동
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

module.exports = router;