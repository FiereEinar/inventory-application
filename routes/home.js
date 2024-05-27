const express = require('express');
const router = express.Router();

const itemController = require('../controllers/itemController');
const categoryController = require('../controllers/categoryController');

// TODO: create a dashboard controller
router.get('/dashboard', (req, res) => {
  res.render('dashboard', { title: 'Dashboard' });
});

// item route
router.get('/items', itemController.item_list);

router.get('/item/add', itemController.item_add_get);

router.post('/item/add', itemController.item_add_post);

router.get('/item/:id/edit', itemController.item_edit_get);

router.post('/item/:id/edit', itemController.item_edit_post);

router.get('/item/:id', itemController.item_detail);

// category route
router.get('/categories', categoryController.category_list);

router.get('/category/:id', categoryController.category_detail);

module.exports = router;
