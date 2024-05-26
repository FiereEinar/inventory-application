const express = require('express');
const router = express.Router();

const itemController = require('../controllers/itemController');
const categoryController = require('../controllers/categoryController');

// TODO: create a dashboard controller
router.get('/dashboard', (req, res) => {
  res.render('dashboard', { title: 'Dashbaord' });
});

// item route
router.get('/items', itemController.item_list);


// category route
router.get('/categories', categoryController.category_list);

module.exports = router;
