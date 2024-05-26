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
