const express = require('express');
const router = express.Router();

const itemController = require('../controllers/itemController');

// TODO: create a dashboard controller
router.get('/dashboard', (req, res) => {
  res.render('dashboard', { title: 'Dashbaord' });
});

router.get('/items', itemController.item_list);

module.exports = router;
