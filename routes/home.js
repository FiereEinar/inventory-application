const express = require('express');
const router = express.Router();

const itemController = require('../controllers/itemController');
const categoryController = require('../controllers/categoryController');
const dashboardController = require('../controllers/dashboardController');

// TODO: create a dashboard controller
router.get('/dashboard', dashboardController.index);

// item routes
router.get('/items', itemController.item_list);

router.get('/item/add', itemController.item_add_get);

router.post('/item/add', itemController.item_add_post);

router.get('/item/:id/edit', itemController.item_edit_get);

router.post('/item/:id/edit', itemController.item_edit_post);

router.get('/item/:id/delete', itemController.item_delete_get);

router.post('/item/:id/delete', itemController.item_delete_post);

router.get('/item/:id', itemController.item_detail);

// category routes
router.get('/categories', categoryController.category_list);

router.get('/category/add', categoryController.category_add_get);

router.post('/category/add', categoryController.category_add_post);

router.get('/category/:id/edit', categoryController.category_edit_get);

router.post('/category/:id/edit', categoryController.category_edit_post);

router.get('/category/:id/delete', categoryController.category_delete_get);

router.post('/category/:id/delete', categoryController.category_delete_post);

router.get('/category/:id', categoryController.category_detail);

module.exports = router;
