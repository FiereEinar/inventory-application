const Item = require('../models/item');
const Category = require('../models/category');
const asyncHandler = require("express-async-handler");

exports.category_list = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 }).exec();

  res.render('category_views/category_list', {
    title: 'Category List',
    categories: categories
  });
});

exports.category_detail = asyncHandler(async (req, res) => {
  const [category, categoryItems] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).populate('category').sort({ name: 1 }).exec()
  ]);
  // const category = await Category.findById(req.params.id).exec();
  // const categoryItems = await Item.find({ category: category._id }).sort({ name: 1 }).exec()
  const num_of_items = categoryItems.length;

  res.render('category_views/category_detail', {
    title: 'Category Detail',
    category: category,
    num_of_items: num_of_items,
    categoryItems: categoryItems
  });
});

