const Item = require('../models/item');
const Category = require('../models/category');
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const cloudinary = require('../utils/cloudinary');
const upload = require('../utils/multer');
const fs = require('fs/promises');

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
  upload.single('image'),

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

    let result = null;
    const defaultImg = 'https://res.cloudinary.com/dwpfwf7gz/image/upload/v1716853804/kxl6kt1qtumtlcdy6qx6.webp';
    const defaultPublicID = 'kxl6kt1qtumtlcdy6qx6';

    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path);
      await fs.unlink(req.file.path);
    }

    const item = new Item({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      cost_price: req.body.cost_price,
      stocks: req.body.stocks,
      img: {
        public_id: result ? result.public_id : defaultPublicID,
        url: result ? result.secure_url : defaultImg
      }
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
    title: 'Edit Item',
    categories: categories,
    item: item,
  });
});

exports.item_edit_post = [
  upload.single('image'),

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

    let result = null;
    const previousImgUrl = req.body.previous_img;
    const previousPublicID = req.body.previous_public_id;

    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path);
      await fs.unlink(req.file.path);
    }

    const item = new Item({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      cost_price: req.body.cost_price,
      stocks: req.body.stocks,
      date_added: req.body.date_added,
      _id: req.params.id,
      img: {
        public_id: result ? result.public_id : previousPublicID,
        url: result ? result.secure_url : previousImgUrl
      }
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

exports.item_delete_get = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id).populate('category').exec();

  res.render('item_views/delete_item', {
    title: 'Delete Item',
    item: item,
  });
});

exports.item_delete_post = asyncHandler(async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.redirect('/home/items');
});