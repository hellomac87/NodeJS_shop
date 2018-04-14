var express = require('express');
var router = express.Router();
var ProductsModel = require('../models/ProductsModel');

var co = require('co');
var paginate = require('express-paginate');

/* GET home page. */

router.get('/', function(req, res){
    ProductsModel.find( function(err, products){ //첫번째 인자는 err, 두번째는 받을 변수명
        res.render('home', { products : products}); // DB에서 받은 products를 products변수명으로 내보냄
    })
});


/* pagination 적용해보는중 
router.get('/', paginate.middleware(3,50), async (req, res) => {
    const [ results, itemCount ] = await Promise.all([
        ProductsModel.find().sort('-created_at').limit(req,query.limit).skip(req.skip).exec(),
        ProductsModel.count({})
    ]);
    const pageCount = Math.ceil(itemCount / req.query.limit);

    const pages = paginate.getArrayPages(req)( 4 , pageCount, req.query.page);

    res.render('home', {
        products : results , 
        pages: pages,
        pageCount : pageCount,
    })
})
*/
module.exports = router;