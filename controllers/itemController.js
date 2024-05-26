const Item = require('../models/item');
const Category = require('../models/category');
const asyncHandler = require("express-async-handler");

exports.item_list = asyncHandler(async (req, res) => {
  const items = await Item.find().sort({ name: 1 }).populate("category").exec();

  res.render('item_views/item_list', {
    title: 'Item List',
    items: items
  });
});

exports.item_detail = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id).populate('category').exec();

  res.render('item_views/item_detail', {
    title: 'Item Detail',
    item: item
  });
});
