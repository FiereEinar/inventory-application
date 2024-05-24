const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => {
  res.render('dashboard', { title: 'Dashbaord' });
});

router.get('/items', (req, res) => {
  res.render('item_views/item_list', { title: 'Item List' });
});

module.exports = router;
