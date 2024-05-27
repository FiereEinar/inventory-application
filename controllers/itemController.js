const Item = require('../models/item');
const Category = require('../models/category');
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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

exports.item_add_get = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 }).exec();

  res.render('item_views/add_item_form', {
    title: 'Add Item',
    categories: categories
  });
});

exports.item_add_post = [
  body('name', 'Name must be 2 characters above and 50 characters max')
    .trim()
    .isLength({ min: 2, max: 50 })
    .escape(),
  body('category', 'Category must not be empty')
    .trim()
    .isLength({ min: 2, max: 50 })
    .escape(),
  body('price', 'Price must be a positive number')
    .isFloat({ min: 0 })
    .escape(),
  body('cost_price', 'Cost price must be a positive number')
    .isFloat({ min: 0 })
    .escape(),
  body('stocks', 'Stocks must be a positive number')
    .isFloat({ min: 0 })
    .escape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      cost_price: req.body.cost_price,
      stocks: req.body.stocks,
    });

    if (!errors.isEmpty()) {
      const categories = await Category.find().sort({ name: 1 }).exec();

      res.render('item_views/add_item_form', {
        title: 'Add Item',
        categories: categories,
        item: item,
        errors: errors.array()
      });
    } else {
      await item.save();
      res.redirect('/home/items');
    }
  })
];

exports.item_edit_get = asyncHandler(async (req, res) => {
  const [categories, item] = await Promise.all([
    Category.find().sort({ name: 1 }).exec(),
    Item.findById(req.params.id).populate('category').exec()
  ]);

  res.render('item_views/add_item_form', {
    title: 'Add Item',
    categories: categories,
    item: item,
  });
});

exports.item_edit_post = [
  body('name', 'Name must be 2 characters above and 50 characters max')
    .trim()
    .isLength({ min: 2, max: 50 })
    .escape(),
  body('category', 'Category must not be empty')
    .trim()
    .isLength({ min: 2, max: 50 })
    .escape(),
  body('price', 'Price must be a positive number')
    .isFloat({ min: 0 })
    .escape(),
  body('cost_price', 'Cost price must be a positive number')
    .isFloat({ min: 0 })
    .escape(),
  body('stocks', 'Stocks must be a positive number')
    .isFloat({ min: 0 })
    .escape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      cost_price: req.body.cost_price,
      stocks: req.body.stocks,
      _id: req.params.id
    });

    if (!errors.isEmpty()) {
      const categories = await Category.find().sort({ name: 1 }).exec();

      res.render('item_views/add_item_form', {
        title: 'Add Item',
        categories: categories,
        item: item,
        errors: errors.array()
      });
    } else {
      const updatedItem = await Item.findByIdAndUpdate(req.params.id, item, {});
      res.redirect(updatedItem.url);
    }
  })
];

