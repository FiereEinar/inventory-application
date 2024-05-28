const Item = require('../models/item');
const Category = require('../models/category');
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res) => {
  const [itemsCount, categoryCount, lowStockItems] = await Promise.all([
    Item.countDocuments({}).exec(),
    Category.countDocuments({}).exec(),
    Item.countDocuments({ stocks: { $lte: 10 } }).exec(),
  ]);

  res.render('dashboard', {
    title: 'Dashboard',
    itemsCount: itemsCount,
    categoryCount: categoryCount,
    lowStockItems: lowStockItems
  })
});
