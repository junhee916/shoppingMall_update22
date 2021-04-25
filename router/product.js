const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')
const multer = require('multer')

const {
    products_get_all,
    products_get_product,
    products_post_product,
    products_patch_product,
    products_delete_all,
    products_delete_product
} = require('../controller/product')


// const storage = multer.diskStorage({
//     destination : function (req, file, cb){
//         cb(null, './uploads/')
//     },
//     filename : function (req, file, cb){
//         cb(null, new Date().toISOString() + file.originalname)
//     }
// })
//
// const fileFilter = (req, file, cb) => {
//     if(file.mimetype === 'image/jpg' || file.mimetype === 'image/png'){
//         cb(null, true)
//     }
//     else{
//         cb(null, false)
//     }
// }
//
// const upload = multer({
//     storage : storage,
//     limit : {
//         fileSize : 1024 * 1024 * 5
//     },
//     fileFilter : fileFilter
// })

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-'));
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


// total get product
router.get('/', products_get_all)

// detail get product
router.get('/:productId', checkAuth, products_get_product)

// register product
router.post('/', checkAuth, upload.single('productImage') ,products_post_product)

// update product
router.patch('/:productId', checkAuth, products_patch_product)

// total delete product
router.delete('/', products_delete_all)

// detail delete product
router.delete('/:productId', checkAuth, products_delete_product)

module.exports = router