const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')

const {
    products_get_all,
    products_get_product,
    products_post_product,
    products_patch_product,
    products_delete_all,
    products_delete_product
} = require('../controller/product')


// total get product
router.get('/', products_get_all)

// detail get product
router.get('/:productId', checkAuth, products_get_product)

// register product
router.post('/', checkAuth, products_post_product)

// update product
router.patch('/:productId', checkAuth, products_patch_product)

// total delete product
router.delete('/', products_delete_all)

// detail delete product
router.delete('/:productId', checkAuth, products_delete_product)

module.exports = router